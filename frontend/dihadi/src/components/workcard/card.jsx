import './card.css';
import { useNavigate } from "react-router-dom";

// FIXED: Removed useNavigate and useLocation from inside this non-component helper function!
function formatTimeAgo(dateString) {
  if (!dateString) return "Just now";
  
  const postDate = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - postDate) / 1000);

  if (secondsAgo < 60) return "Just now";
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo}d ago`;
}

export default function Card({ work, item, currentUser }) {
  // Support either 'work' or 'item' prop
  const navigate = useNavigate();

  const data = work || item;

  const createdAt = data?.createdAt || new Date().toISOString();
  const exactTime = new Date(createdAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Handle differences between Work (title/owner_name/worker_type) and Job (name/occupation)
  const isJob = Boolean(data?.occupation || data?.name);
  const displayTitle = data?.title || data?.name || "Title / Name";
  const badgeLabel = data?.worker_type || data?.occupation || "General";
  const personLabel = isJob ? "Applicant Name:" : "Owner:";
  const personValue = data?.owner_name || data?.name || "N/A";

  // Format Pay correctly (prevents ₹Will Discuss)
  const formattedPay = data?.pay === "Will Discuss" ? "Will Discuss" : `₹${data?.pay || "0"}`;

  // 1. Get Current User ID (checks both _id and id)
 const currentUserId = currentUser?._id || currentUser?.id;

const ownerId = data?.createdBy;

const isOwner =
    currentUserId &&
    ownerId &&
    String(currentUserId) === String(ownerId);

  // DEBUG LOGGING: Open your Browser Console (F12) to see why it evaluates to true/false
  console.log("Card Ownership Debug:", {
    title: displayTitle,
    currentUserId,
    ownerId,
    isOwner
  });

  return (
    <div className="card shadow-sm border rounded h-100 custom-card"  onClick={() => navigate(`/works/${data._id}`)}>
      {/* Header */}
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
        <div className="text-truncate me-2">
          <h5 className="card-title mb-0 fw-bold text-truncate">{displayTitle}</h5>
          <span className={`badge mt-1 ${isJob ? 'bg-success' : 'bg-primary'} text-white`}>
            {badgeLabel}
          </span>
        </div>
        <span className="badge bg-light text-dark border flex-shrink-0" title={exactTime}>
          🕒 {formatTimeAgo(createdAt)}
        </span>
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column py-2">
        <p className="card-text text-secondary mb-3 card-details-text">
          {data?.details || "No details provided."}
        </p>

        {/* Metadata */}
        <ul className="list-unstyled mb-0 mt-auto pt-2 border-top small-text">
          <li className="text-truncate">
            <strong>{personLabel}</strong> {personValue}
          </li>
          <li className="text-truncate">
            <strong>Location:</strong> {data?.address ? `${data.address}, ${data.city}` : `${data?.city || "City"}, ${data?.state || "State"}`}
          </li>
          <li>
            <strong>Pay:</strong> <span className="fw-semibold text-success">{formattedPay}</span>
          </li>
          <li>
            <strong>Phone:</strong> {data?.phone_no || "N/A"}
          </li>
        </ul>
      </div>

      
    </div>
  );
}
