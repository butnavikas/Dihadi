import { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const [myJob, setMyJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobRefreshKey, setJobRefreshKey] = useState(0);

  // Track token in React State
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChanged", syncToken);
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("authChanged", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, []);

  useEffect(() => {
  const fetchMyJob = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setMyJob(null);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/jobs/my-job`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        }
      );

      setMyJob(response.data);

    } catch {
      // 404 simply means user has not created a job
      setMyJob(null);
    }
  };

  fetchMyJob();
}, [token, location.pathname, jobRefreshKey]);

  useEffect(() => {
    const refreshMyJob = () => {
      setToken(localStorage.getItem("token"));
      setJobRefreshKey((key) => key + 1);
    };

    window.addEventListener("jobProfileChanged", refreshMyJob);

    return () => {
      window.removeEventListener("jobProfileChanged", refreshMyJob);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMyJob(null);
    window.dispatchEvent(new Event("authChanged"));
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault(); // 🛑 STOP page reloads!
    const query = searchQuery.trim();

    // Smart route routing based on active path
    if (location.pathname.includes("/works") || location.pathname === "/") {
      navigate(query ? `/works?search=${encodeURIComponent(query)}` : "/works");
    } else {
      navigate(query ? `/findworkers?search=${encodeURIComponent(query)}` : "/findworkers");
    }
  };



  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <b>Dihadi</b>
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-main-links d-flex gap-3 align-items-center">
            <li className="nav-item dropdown list-unstyled">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Menu
              </a>
              <ul className="dropdown-menu">
                <li>
                  {token && (
                    <Link to="/add-work" className="dropdown-item">Add Work</Link>
                  )}
                </li>
                
                <li>
                  <Link to="/findworkers" className="dropdown-item">Find Workers</Link>
                </li>
                
                <li>
                      {token && (
                                 <>
                                 <hr className="dropdown-divider" />

       {myJob ? (
      <Link
        to={`/jobs/${myJob._id}`}
        className="dropdown-item"
      >
        View your job profile
      </Link>
    ):(
      <Link
        to="/job-form"
        className="dropdown-item"
      >
        Add your job profile
      </Link>
    )}
  </>
)}
                </li>
              </ul>
            </li>
          </div>

          {/* Search Form */}
          <form className="d-flex navbar-search" role="search" onSubmit={handleSearch}>
            <input 
              className="form-control me-2" 
              type="text" 
              placeholder={
                location.pathname.includes("/works") || location.pathname === "/"
                  ? "Search works (e.g. Construction, Delhi)..." 
                  : "Search workers (e.g. Plumber, Labour)..."
              } 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          {/* Authentication Links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item d-flex gap-2">
                {!token && (
                  <>
                    <Link to="/signup" className="nav-link active">Signup</Link>
                    <Link to="/login" className="nav-link active">Login</Link>
                  </>
                )}

                {token && (
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-link nav-link active text-danger" 
                    style={{ textDecoration: 'none' }}
                  >
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
