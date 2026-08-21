import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import "./jobid.css";
const API_URL = import.meta.env.VITE_API_URL;
export default function Jobid_Card() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);


//get current user

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {

            try {

                const decodedUser = jwtDecode(token);

                setCurrentUser(decodedUser);

            } catch {

                console.error("Invalid token");

            }

        }

    }, []);


//get job by id

    useEffect(() => {

        const fetchJob = async () => {

            try {

                const response = await axios.get(
                    `${API_URL}/jobs/${id}`
                );

                setJob(response.data);

            } catch (error) {

                console.error(
                    "Error fetching job:",
                    error.response?.data || error.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchJob();

    }, [id]);


   //loading screen

    if (loading) {

        return (
            <div className="job-loading">
                <p>Loading...</p>
            </div>
        );

    }


// if the job is not found

    if (!job) {

        return (
            <div className="job-not-found">

                <h4>
                    Worker Profile Not Found
                </h4>

                <button
                    onClick={() => navigate("/findworkers")}
                >
                    ← Back
                </button>

            </div>
        );

    }

//current user

    const currentUserId =
        currentUser?._id || currentUser?.id;


//owner
    const ownerId =
        typeof job.createdBy === "object"
            ? job.createdBy?._id || job.createdBy?.id
            : job.createdBy;


//ownership

    const isOwner =
        currentUserId &&
        ownerId &&
        String(currentUserId) === String(ownerId);

//edit 

    const handleEdit = () => {

        navigate(`/job-form?id=${job._id}`);

    };

//delte

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job profile?"
        );

        if (!confirmDelete) return;


        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/jobs/delete/${job._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert("Job profile deleted successfully");
            window.dispatchEvent(new Event("jobProfileChanged"));

            navigate("/findworkers");


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job profile"
            );

        }

    };


//ui
    return (

        <div className="job-details-page">

            <div className="job-details-card">


                {/* TOP */}

                <div className="job-top">

                    <div>

                        <span className="work-badge">
                            {job.occupation || "Occupation"}
                        </span>

                        <h2>
                            {job.name}
                        </h2>

                        <p className="location">
                            📍 {job.city}, {job.state}
                        </p>

                    </div>


                    <div className="pay">

                        {job.pay || "Will Discuss"}

                    </div>

                </div>


                {/* DETAILS */}

                <div className="work-details-section">

                    <h5>
                        About
                    </h5>

                    <p>
                        {job.details || "No details provided."}
                    </p>

                </div>


                {/* INFORMATION */}

                <div className="work-info">

                    <div>

                        <span>Name</span>

                        <strong>
                            {job.name || "N/A"}
                        </strong>

                    </div>


                    <div>

                        <span>Occupation</span>

                        <strong>
                            {job.occupation || "N/A"}
                        </strong>

                    </div>


                    <div>

                        <span>Address</span>

                        <strong>
                            {job.address || "N/A"}
                        </strong>

                    </div>


                    <div>

                        <span>Phone</span>

                        <strong>
                            {job.phone_no || "N/A"}
                        </strong>

                    </div>

                </div>


                {/* OWNER BUTTONS */}

                {isOwner && (

                    <div className="job-actions">

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
