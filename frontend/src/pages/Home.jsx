import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import useAuth from "../context/AuthContext";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import ItineraryList from "../components/itinerary/ItineraryList";
import { useTheme } from "@mui/material/styles";
import UpgradeDialog from "../components/UpgradeDialog";
import MostVisited from "../components/itinerary/MostVisited";

const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Home = () => {
  const { token, user, setUser } = useAuth(); // Add user to destructuring
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let { theme } = useTheme();

  // const { itineraries, setItineraries } = useItinerary();
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedInput, setDebouncedInput] = useState(""); // State for debounced input
  const [formData, setFormData] = useState({
    travelType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false); // State for upgrade dialog

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

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
          // Use the correct endpoint for autocomplete
          const res = await axios.get("/itenaries/autocomplete", {
            params: { location: debouncedInput },
            headers: { Authorization: `Bearer ${token}` },
          });
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

  // Update your fetchItineraries function
  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/itenaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to fetch initial data
  useEffect(() => {
    if (token) {
      fetchItineraries();
    }
  }, []);

  // Update the useEffect for refreshing user data
  useEffect(() => {
    if (token && user?._id) {
      // Check for both token and user ID
      const refreshUserData = async () => {
        try {
          const response = await axios.get(`/users/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error refreshing user data:", error);
          enqueueSnackbar("Failed to refresh user data", {
            variant: "error",
          });
        }
      };
      refreshUserData();
    }
  }, [token, user?._id]); // Add user._id to dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, location: query });
  };

  const handleLocationChange = (e) => {
    setQuery(e.target.value); // Update query state
    setActiveIndex(-1);
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user has reached free plan limit using itineraryCount
      if (!user.isSubscribed && user.itineraryCount >= 2) {
        setShowUpgradeDialog(true);
        return;
      }

      await axios.post("/itenaries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear form data
      setFormData({
        travelType: "",
        location: "",
        startDate: "",
        endDate: "",
        budget: "",
      });
      setQuery("");
      // Fetch updated user data to get new itineraryCount
      await fetchItineraries();
      enqueueSnackbar("Itinerary created successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);

      if (error.response?.status === 403) {
        enqueueSnackbar(
          "Free plan limit reached. Please upgrade to continue.",
          {
            variant: "warning",
            action: (key) => (
              <Button
                color="primary"
                size="small"
                onClick={() => {
                  closeSnackbar(key);
                  setShowUpgradeDialog(true);
                }}
              >
                Upgrade Now
              </Button>
            ),
          }
        );
      } else {
        enqueueSnackbar("Error creating itinerary", {
          variant: "error",
        });
      }
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

  // Enhanced handleDelete with undo and localStorage
  const handleDelete = (id) => {
    const itineraryToDelete = itineraries.find((it) => it._id === id);
    if (!itineraryToDelete) return;

    // Store in localStorage
    localStorage.setItem("deletedItinerary", JSON.stringify(itineraryToDelete));
    // Optimistically remove from UI
    setItineraries((prev) => prev.filter((it) => it._id !== id));

    let undoTimeout = setTimeout(async () => {
      try {
        await axios.delete(`/itenaries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("deletedItinerary");
        fetchItineraries();
      } catch (error) {
        enqueueSnackbar("Error deleting itinerary from server", {
          variant: "error",
        });
      }
    }, 5000); // 5 seconds to undo

    enqueueSnackbar("Are you sure you want to delete this itinerary?", {
      variant: "warning",
      action: (key) => (
        <Button
          color="primary"
          size="small"
          onClick={async () => {
            clearTimeout(undoTimeout);
            // Restore in UI
            setItineraries((prev) => [itineraryToDelete, ...prev]);
            localStorage.removeItem("deletedItinerary");
            closeSnackbar(key);
            enqueueSnackbar("Itinerary restored!", { variant: "success" });
          }}
        >
          Undo
        </Button>
      ),
      autoHideDuration: 5000,
      onClose: (event, reason, key) => {
        if (reason === "timeout") {
          // After timeout, item is deleted from DB in setTimeout above
        }
      },
    });
  };

  if (!user.isSubscribed && user.itineraryCount >= 2) {
    console.log("checking");

    enqueueSnackbar(
      "You have reached the limit for creating more itineraries. Use Premium version for unlimited itineraries.",
      {
        variant: "warning",
        persist: false,
        action: (key) => (
          <Button
            color="primary"
            size="small"
            onClick={() => {
              closeSnackbar(key);
              handleSubscribe();
            }}
          >
            Upgrade Now
          </Button>
        ),
      }
    );
    return;
  }

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/stripe/create-checkout-session",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      enqueueSnackbar("Error creating subscription", {
        variant: "error",
        action: (key) => (
          <Button
            color="primary"
            size="small"
            onClick={() => {
              closeSnackbar(key);
              setShowUpgradeDialog(true);
            }}
          >
            Retry
          </Button>
        ),
      });
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
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
                user={user} // Pass the user object
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
            <Grid item xs={12}>
              <MostVisited />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        onUpgrade={() => {
          setShowUpgradeDialog(false);
          handleSubscribe();
        }}
      />
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
