import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import useAuth from "../context/AuthContext";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const Signup = () => {
  const { token, setToken, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSend = {
        username,
        email,
        password,
        confirmPassword,
      };

      const response = await axios.post("/auth/register", dataToSend);
      console.log(response.data);

      // Store the token in localStorage if provided in response
      setToken(response.data.token);
      setUser(response.data.user);

      navigate("/home");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ minHeight: "100vh", bgcolor: "background.default" }}
      autoComplete="off"
    >
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="new-password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <HowToRegIcon />
              }
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
