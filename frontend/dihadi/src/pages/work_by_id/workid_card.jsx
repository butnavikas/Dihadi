import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import "./workid_card.css";
const API_URL = import.meta.env.VITE_API_URL;
// if someone clicks the card
export default function Workid_Card() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [work, setWork] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser);
      } catch {
        console.log("Invalid token");
      }
    }
  }, []);

  // Get work
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/works/${id}`
        );

        setWork(response.data);
      } catch (error) {
        console.error(
          "Error fetching work:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="work-loading">
        <p>Loading...</p>
      </div>
    );
  }

  // Not found
  if (!work) {
    return (
      <div className="work-not-found">
        <h4>Work posting not found</h4>

        <button onClick={() => navigate("/works")}>
          ← Back
        </button>
      </div>
    );
  }

  // Current user ID
  const currentUserId =
    currentUser?._id || currentUser?.id;

  // Owner ID
  const ownerId =
    typeof work.createdBy === "object"
      ? work.createdBy?._id || work.createdBy?.id
      : work.createdBy;

  // Check ownership
  const isOwner =
    currentUserId &&
    ownerId &&
    String(currentUserId) === String(ownerId);

  // Edit
  const handleEdit = () => {
    navigate(`/add-work?id=${work._id}`);
  };

  // Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this posting?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/works/delete/${work._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Work deleted successfully");

      navigate("/works");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete work"
      );
    }
  };

  return (
    <div className="work-details-page">

      <div className="work-details-card">

        {/* Top */}
        <div className="work-top">

          <div>
            <span className="work-badge">
              {work.worker_type || "Work"}
            </span>

            <h2>{work.title}</h2>

            <p className="location">
              📍 {work.city}, {work.state}
            </p>
          </div>

          <div className="pay">
            {work.pay === "Will Discuss"
              ? "Will Discuss"
              : `₹${work.pay || "0"}`}
          </div>

        </div>

        {/* Details */}
        <div className="work-details-section">

          <h5>Work Details</h5>

          <p>
            {work.details || "No details provided."}
          </p>

        </div>

        {/* Information */}
        <div className="work-info">

          <div>
            <span>Owner</span>
            <strong>
              {work.owner_name || "N/A"}
            </strong>
          </div>

          <div>
            <span>Worker Type</span>
            <strong>
              {work.worker_type || "N/A"}
            </strong>
          </div>

          <div>
            <span>Address</span>
            <strong>
              {work.address || "N/A"}
            </strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>
              {work.phone_no || "N/A"}
            </strong>
          </div>

        </div>

        {/* Buttons */}
        {isOwner && (
          <div className="work-actions">

            <button
              className="edit-btn"
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
