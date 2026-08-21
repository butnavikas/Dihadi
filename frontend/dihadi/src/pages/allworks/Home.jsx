import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams , useNavigate } from 'react-router-dom';

import Card from "../../components/workcard/card";
//this is main page where all the works are present
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {

  // Get search query from URL
  // Example: /works?search=Delhi
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  console.log("CURRENT USER:", currentUser);
  console.log("WORKS:", works);
  // ==========================================
  // GET CURRENT USER + FETCH POSTINGS
  // ==========================================

  useEffect(() => {

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Decode logged-in user
    if (token) {
      try {

        const decodedUser = jwtDecode(token);

        setCurrentUser(decodedUser);

        console.log("Logged in user:", decodedUser);

      } catch (err) {

        console.error("Failed to decode token:", err);

      }
    }


    // Fetch postings
    const fetchPostings = async () => {

      try {

        const [worksRes] = await Promise.all([

          // Send search to backend
          axios.get(`${API_URL}/works`, {
            params: {
              search: search
            }
          }),

          // Jobs for now
          axios.get(`${API_URL}/jobs`)

        ]);


        setWorks(worksRes.data);
      } catch (error) {

        console.error(
          "Error fetching postings:",
          error.response?.data || error.message
        );

      } finally {

        setLoading(false);

      }
    };


    fetchPostings();

  }, [search]);


  // ==========================================
  // EDIT
  // ==========================================

const handleEdit = (item) => {

  navigate(`/add-work?id=${item._id}`);

};


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this posting?")) {
      return;
    }


    try {

      const token = localStorage.getItem("token");


      await axios.delete(
        `${API_URL}/works/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      // Remove deleted card immediately
      setWorks((prev) =>
        prev.filter((item) => item._id !== id)
      );


    } catch (error) {

      console.error(
        "Delete failed:",
        error.response?.data || error.message
      );


      alert(
        error.response?.data?.message ||
        "Failed to delete posting"
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="container text-center my-5">
        <h4>Loading postings...</h4>
      </div>
    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <>




      <div className="container my-4">

        <h3 className="mb-3">
          Work Postings
        </h3>


        {/* Show current search */}
        {search && (
          <p className="text-muted">
            Search results for: <strong>{search}</strong>
          </p>
        )}


        <div className="row g-3 mb-5">

          {works.length > 0 ? (

            works.map((work) => (

              <div
                className="col-md-6 col-lg-4"
                key={work._id}
              >

                <Card
                  work={work}
                  type="work"
                  currentUser={currentUser}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

              </div>

            ))

          ) : (

            <p className="text-muted">
              {search
                ? `No work postings found for "${search}".`
                : "No work postings available."
              }
            </p>

          )}

        </div>

      </div>

    </>

  );
}
