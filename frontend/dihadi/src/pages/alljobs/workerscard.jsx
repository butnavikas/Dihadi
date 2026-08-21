import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../../components/jobcard/worker_job_card";
const API_URL = import.meta.env.VITE_API_URL;

export default function Workers_Card() {
const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);


    // =====================================
    // GET CURRENT USER
    // =====================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            try {

                const decodedUser = jwtDecode(token);

                setCurrentUser(decodedUser);

            } catch (error) {

                console.error("Failed to decode token:", error);

            }
        }

    }, []);


    // =====================================
    // FETCH JOB PROFILES
    // =====================================

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                const response = await axios.get(
                    `${API_URL}/jobs`,
                    {
                        params: {
                            search: search
                        }
                    }
                );

                setJobs(response.data);

            } catch (error) {

                console.error(
                    "Error fetching workers:",
                    error.response?.data || error.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchJobs();

    }, [search]);

//edit

    const handleEdit = (job) => {

        navigate(`/job-form?id=${job._id}`);

    };


   //delete

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this job profile?"
            )
        ) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/jobs/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJobs((prev) =>
                prev.filter((job) => job._id !== id)
            );

        } catch (error) {

            console.error(
                "Delete failed:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete job profile"
            );

        }

    };


//loading

    if (loading) {

        return (
            <div className="container text-center my-5">
                <h4>Loading worker profiles...</h4>
            </div>
        );

    }
//ui
    return (
        <>
    
        <div className="container my-4">
          
            <h3 className="mb-3">
                Worker Profiles
            </h3>

            {search && (
                <p className="text-muted">
                    Search results for:
                    <strong> {search}</strong>
                </p>
            )}

            <div className="row g-3 mb-5">

                {jobs.length > 0 ? (

                    jobs.map((job) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={job._id}
                        >

                            <Card
                                job={job}
                                currentUser={currentUser}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                        </div>

                    ))

                ) : (

                    <p className="text-muted">
                        {search
                            ? `No worker profiles found for "${search}".`
                            : "No workers available."
                        }
                    </p>

                )}

            </div>

        </div>
        </>
    );
}
