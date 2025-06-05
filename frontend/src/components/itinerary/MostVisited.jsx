import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "../../utils/axios";
import useAuth from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MostVisited = () => {
  const { token } = useAuth(); // <-- Call useAuth as a function
  if (!token) return null; // Ensure user is authenticated before fetching data
  const [mostVisited, setMostVisited] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchMostVisited = async () => {
      try {
        const res = await axios.get("/itenaries/most-visited", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from context
          },
        });
        setMostVisited(res.data);
        setCurrent(0); // Reset to first slide on new data
      } catch (err) {
        setMostVisited(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMostVisited();
  }, [token]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!mostVisited || mostVisited.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === mostVisited.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [mostVisited, current]);

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="h6">Most Visited Itinerary</Typography>
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!mostVisited || mostVisited.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography variant="h6">Most Visited Itinerary</Typography>
        <Typography color="text.secondary">No data available.</Typography>
      </Paper>
    );
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? mostVisited.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev === mostVisited.length - 1 ? 0 : prev + 1));
  };

  const itinerary = mostVisited[current];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <LocationOnIcon color="primary" />
        <Typography variant="h6">Most Visited Itineraries</Typography>
      </Stack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={handlePrev} aria-label="Previous">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box sx={{ flex: 1, mx: 2 }}>
          <Link
            to={`/itineraries/${itinerary._id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <FlightTakeoffIcon sx={{ mr: 1, fontSize: "small" }} />
              {itinerary.travelType}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <LocationOnIcon sx={{ mr: 1, fontSize: "small" }} />
              {itinerary.location}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <DateRangeIcon sx={{ mr: 1, fontSize: "small" }} />
              {itinerary.startDate?.slice(0, 10)} to{" "}
              {itinerary.endDate?.slice(0, 10)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <CurrencyRupeeIcon sx={{ mr: 1, fontSize: "small" }} />
              {itinerary.budget}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visits: {itinerary.visitCount}
            </Typography>
          </Link>
        </Box>
        <IconButton onClick={handleNext} aria-label="Next">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography variant="caption">
          {current + 1} / {mostVisited.length}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MostVisited;
