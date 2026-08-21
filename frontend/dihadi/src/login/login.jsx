import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });

    console.log("Logged in response:", res.data);

    // 1. Extract token (matching variable name 'res')
    const token = res.data.token; 

    if (!token) {
      alert("Login succeeded, but no token was returned by the server!");
      return;
    }

    // 2. Save token to localStorage
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("authChanged"));

    alert("Login successful!");
    navigate("/");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Invalid credentials or server error");
  }
};

  return (
    <div className="auth-page-container">
      <div className="auth-card shadow-sm border rounded">
        <h3 className="text-center fw-bold mb-4">Login to Your Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
