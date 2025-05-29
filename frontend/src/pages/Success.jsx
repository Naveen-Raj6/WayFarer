import React from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAuth from "../context/AuthContext";
import { useEffect } from "react";
import axios from "../utils/axios";
const Success = () => {
  const navigate = useNavigate();
  let { user, setUser, token } = useAuth();
  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    axios
      .get("/users/" + user._id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/home")}
            sx={{ mb: 4 }}
          >
            Back to Home
          </Button>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: "success.main",
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom align="center">
              Payment Successful!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Thank you for subscribing to our premium plan. You now have access
              to unlimited itinerary planning!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{ mt: 2 }}
            >
              Start Planning
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Success;
