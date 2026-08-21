import { useNavigate } from "react-router-dom";
import "./w_card.css";

export default function Workers_All_Card({
  job
}) {

  const navigate = useNavigate();

  // CLICK CARD
  const handleCardClick = () => {
    navigate(`/jobs/${job._id}`);
  };


  return (
    <div
      className="card shadow-sm border rounded h-100 custom-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >

      {/* HEADER */}
      <div className="card-header bg-white">

        <h5 className="card-title mb-1">
          {job?.name || "Name"}
        </h5>

        <span className="badge bg-success">
          {job?.occupation || "Occupation"}
        </span>

      </div>


      {/* BODY */}
      <div className="card-body">

        <p className="card-text text-secondary">
          {job?.details || "No details provided."}
        </p>

        <p className="mb-1">
          <strong>Location:</strong>{" "}
          {job?.address
            ? `${job.address}, ${job.city}`
            : `${job?.city || "City"}, ${job?.state || "State"}`
          }
        </p>

        <p className="mb-1">
          <strong>Phone:</strong>{" "}
          {job?.phone_no || "N/A"}
        </p>

        <p className="mb-0">
          <strong>Pay:</strong>{" "}
          <span className="text-success fw-semibold">
            ₹
            {job?.pay || "Will Discuss"}
          </span>
        </p>

      </div>


     

    </div>
  );
}
