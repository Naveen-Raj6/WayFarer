import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import useItinerary from "../context/ItenaryContext";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Importing the skeleton styles

const Home = () => {
  const { token } = useAuth();
  const { itenaries, setItenaries } = useItinerary();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedInput, setDebouncedInput] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    travelType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  console.log(itenaries);

  // Debounce the input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(query); // Update debounced input after delay
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler); // Clear timeout on cleanup
    };
  }, [query]);

  // Fetch suggestions when debounced input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.length > 1) {
        try {
          const res = await axios.get("/itenaries/autocomplete", {
            params: { location: debouncedInput },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res);

          setSuggestions(res.data);
        } catch (err) {
          console.error("Error fetching suggestions", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, location: query });
  };

  const handleLocationChange = (e) => {
    setQuery(e.target.value); // Update query state
    setActiveIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/itenaries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      setItenaries((prev) => [...prev, response.data]);
      alert("Itinerary created successfully!");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const handleSelect = (description) => {
    setQuery(description);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      const selected = suggestions[activeIndex];
      handleSelect(selected);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/itenaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItenaries((prev) => prev.filter((itenary) => itenary._id !== id));
      alert("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const fetchItinaries = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("/itenaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItenaries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchItinaries();
  }, []);

  return (
    <Box>
      {/* Navbar Section - Full Width */}
      <Box sx={{ width: "100%", marginBottom: 4 }}>
        <Navbar />
      </Box>

      {/* Content Section */}
      <Container maxWidth="xl">
        {loading ? (
          <Box>
            <Skeleton height={40} count={5} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Form Section */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  backgroundColor: "#1e1e2f",
                  color: "#fff",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Create a Travel Itinerary
                </Typography>
                <form onSubmit={handleSubmit}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    sx={{ marginBottom: 2 }}
                  >
                    <InputLabel id="travel-type-label" sx={{ color: "#fff" }}>
                      Travel Type
                    </InputLabel>
                    <Select
                      labelId="travel-type-label"
                      label="Travel Type"
                      name="travelType"
                      value={formData.travelType}
                      onChange={handleInputChange}
                      required
                      sx={{
                        color: "#fff",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.23)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.23)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.23)",
                        },
                        ".MuiSvgIcon-root": {
                          color: "#fff",
                        },
                      }}
                    >
                      <MenuItem value="">Select a travel type</MenuItem>
                      <MenuItem value="solo">Solo Travel</MenuItem>
                      <MenuItem value="family">Family Vacation</MenuItem>
                      <MenuItem value="business">Business Trip</MenuItem>
                      <MenuItem value="romantic">Romantic Getaway</MenuItem>
                      <MenuItem value="adventure">Adventure Travel</MenuItem>
                      <MenuItem value="cultural">Cultural Experience</MenuItem>
                      <MenuItem value="luxury">Luxury Vacation</MenuItem>
                      <MenuItem value="budget">Budget Travel</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={query}
                    onChange={handleLocationChange}
                    onKeyDown={handleKeyDown}
                    margin="normal"
                    required
                    InputLabelProps={{ style: { color: "#fff" } }}
                    sx={{ input: { color: "#fff" }, marginBottom: 2 }}
                  />
                  {suggestions.length > 0 && (
                    <ul
                      style={{
                        border: "1px solid #ccc",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        position: "absolute",
                        backgroundColor: "#ffffff",
                        zIndex: 1000,
                        opacity: 1,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {suggestions.map((sug, index) => (
                        <li
                          key={sug}
                          onClick={() => handleSelect(sug)}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            backgroundColor:
                              index === activeIndex ? "#f0f0f0" : "#fff",
                            color: "black",
                          }}
                        >
                          {sug}
                        </li>
                      ))}
                    </ul>
                  )}
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#fff" },
                    }}
                    sx={{
                      input: {
                        color: "#fff",
                        "&::-webkit-calendar-picker-indicator": {
                          filter: "invert(0.8)",
                        },
                      },
                      marginBottom: 2,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#fff" },
                    }}
                    sx={{
                      input: {
                        color: "#fff",
                        "&::-webkit-calendar-picker-indicator": {
                          filter: "invert(0.8)",
                        },
                      },
                      marginBottom: 2,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    InputLabelProps={{ style: { color: "#fff" } }}
                    sx={{ input: { color: "#fff" }, marginBottom: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#4caf50",
                      "&:hover": { backgroundColor: "#45a049" },
                    }}
                  >
                    Create Itinerary
                  </Button>
                </form>
              </Paper>
            </Grid>

            {/* Itinerary List Section */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" gutterBottom component="div">
                  Saved Itineraries
                </Typography>
                {itenaries?.length > 0 ? (
                  <Grid container spacing={2}>
                    {itenaries.map((itinerary, index) => {
                      const startDate = new Date(itinerary.startDate);
                      const endDate = new Date(itinerary.endDate);
                      const totalDays = Math.ceil(
                        (endDate - startDate) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={itinerary._id || index}
                        >
                          <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {itinerary.location || "Unknown Location"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Travel Type:</strong>{" "}
                              {itinerary.travelType || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Total Days:</strong> {totalDays || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Stay:</strong> $
                              {itinerary?.itinerary?.total?.stay || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Food:</strong> $
                              {itinerary?.itinerary?.total?.food || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Travel:</strong> $
                              {itinerary?.itinerary?.total?.travel || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Total Budget:</strong> $
                              {itinerary.budget || "N/A"}
                            </Typography>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(itinerary._id)}
                              sx={{ marginTop: 2 }}
                            >
                              Delete
                            </Button>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Typography component="div">No itineraries found.</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;
