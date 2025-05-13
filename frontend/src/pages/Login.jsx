import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Login = () => {
  const { token, setToken, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ensure the token is properly stored and navigate to the home page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", formData);
      // Store the token and user data in localStorage
      // localStorage.setItem("userToken", response.data.token);
      // localStorage.setItem("user", JSON.stringify(response.data.user));

      setToken(response.data.token);
      setUser(response.data.user);

      // Navigate to the home page after successful login
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="form-container">
        <div className="form-wrapper">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="form-footer">
            Don't have an account? <Link to="/signup">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
