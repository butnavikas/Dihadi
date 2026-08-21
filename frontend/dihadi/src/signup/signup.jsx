import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
const API_URL = import.meta.env.VITE_API_URL;
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/signup`, {
        email,
        password
      });
      console.log("Registered:", res.data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.dispatchEvent(new Event("authChanged"));
      }
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card shadow-sm border rounded">
        <h3 className="text-center fw-bold mb-4">Create an Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              placeholder="name@example.com"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account? <Link to="/login">Login here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
