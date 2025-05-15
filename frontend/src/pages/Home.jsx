import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
// import useItinerary from "../context/ItenaryContext";
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
import { useTheme } from "@mui/material/styles";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import ItineraryList from "../components/itinerary/ItineraryList";

const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Home = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const { showSnackbar } = useSnackbar();

  // const { itenaries, setItenaries } = useItinerary();
  const [itineraries, setItineraries] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedInput, setDebouncedInput] = useState("");

  const [formData, setFormData] = useState({
    travelType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  console.log(itineraries);

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

  const fetchItineraries = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await axios.get("/itenaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Add this useEffect to fetch initial data
  useEffect(() => {
    if (token) {
      fetchItineraries();
    }
  }, [token]);

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
      await axios.post("/itenaries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        travelType: "",
        location: "",
        startDate: "",
        endDate: "",
        budget: "",
      });
      setQuery("");
      await fetchItineraries();
      showSnackbar("Itinerary created successfully!", "success");
    } catch (error) {
      showSnackbar("Error creating itinerary!", "error");
      console.error("Error creating itinerary:", error);
    }
  };

  const handleSelect = (description) => {
    setQuery(description);
    setFormData((prev) => ({ ...prev, location: description }));
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

  const handleDelete = (id) => {
    // Find the itinerary to delete
    const deletedItinerary = itineraries.find((item) => item._id === id);
    // Remove from UI immediately
    setItineraries((prev) => prev.filter((item) => item._id !== id));
    setPendingDelete({ id, data: deletedItinerary });
    // Store in localStorage
    localStorage.setItem("deletedItinerary", JSON.stringify(deletedItinerary));

    // Show snackbar with Undo action
    showSnackbar(
      "Itinerary deleted. Undo?",
      "info",
      <Button
        color="secondary"
        size="small"
        onClick={handleUndo}
        sx={{ color: "goldenrod" }}
      >
        UNDO
      </Button>
    );

    // Set timeout to actually delete after 3s
    const timeout = setTimeout(async () => {
      // Only delete if not undone
      const pending = JSON.parse(localStorage.getItem("deletedItinerary"));
      if (pending && pending._id === id) {
        try {
          await axios.delete(`/itenaries/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showSnackbar("Itinerary deleted from database!", "success");
        } catch (error) {
          showSnackbar("Error deleting itinerary!", "error");
          setItineraries((prev) => [...prev, deletedItinerary]); // Restore if error
        }
        // Remove from localStorage after delete
        localStorage.removeItem("deletedItinerary");
        setPendingDelete(null);
      }
      setUndoTimeout(null);
    }, 3000);
    setUndoTimeout(timeout);
  };

  const handleUndo = () => {
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      setUndoTimeout(null);
    }
    // Get from localStorage
    const deletedItinerary = JSON.parse(
      localStorage.getItem("deletedItinerary")
    );
    if (deletedItinerary) {
      setItineraries((prev) => [deletedItinerary, ...prev]);
      setPendingDelete(null);
      showSnackbar("Itinerary restored!", "success");
      // Remove from localStorage after restore
      localStorage.removeItem("deletedItinerary");
    }
  };

  const suggestionStyles = {
    position: "absolute",
    width: "100%",
    backgroundColor: "background.paper",
    boxShadow: 3,
    borderRadius: 1,
    zIndex: 1000,
    mt: 0.5,
    maxHeight: 200,
    overflowY: "auto",
  };

  return token ? (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <ItineraryForm
                formData={formData}
                query={query}
                suggestions={suggestions}
                activeIndex={activeIndex}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onLocationChange={handleLocationChange}
                onLocationSelect={handleSelect}
                onKeyDown={handleKeyDown}
                suggestionStyles={suggestionStyles}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <ItineraryList
                itineraries={itineraries}
                isLoading={isLoading}
                onDelete={handleDelete}
                capitalizeWords={capitalizeWords}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    />
  );
};

export default Home;
