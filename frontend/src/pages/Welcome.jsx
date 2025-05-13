import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

const Welcome = () => {
  let { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);
  return (
    <div>
      <Navbar />
      <div className="welcome-container">
        <h1>Welcome to Wayfarer!</h1>
        <p>
          We are glad to have you here. Explore our features and enjoy your
          stay!
        </p>
        <button className="explore-button">
          <Link to="/signup" style={{ textDecoration: "none", color: "white" }}>
            Explore
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
