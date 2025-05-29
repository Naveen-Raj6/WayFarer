import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Itinerary = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchItinerary = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/itenaries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);

      setItinerary(res.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch itinerary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary(id);
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate("/home")}
            sx={{
              mb: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Trip to {itinerary?.location}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">{itinerary?.location}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FlightTakeoffIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {itinerary?.travelType} Trip
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DateRangeIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {format(new Date(itinerary?.startDate), "MMM dd")} -{" "}
                    {format(new Date(itinerary?.endDate), "MMM dd, yyyy")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Budget: ₹{itinerary?.budget.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Daily Itinerary Section */}
          <Typography variant="h5" gutterBottom>
            Daily Schedule
          </Typography>
          <Box sx={{ mb: 4 }}>
            {itinerary?.itinerary.days.map((day, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ p: 2, mb: 2, bgcolor: "background.default" }}
              >
                <Typography variant="h6" gutterBottom>
                  Day {index + 1}
                </Typography>
                <List dense>
                  {day?.plan?.map((activity, actIndex) => (
                    <ListItem key={actIndex}>
                      <ListItemText primary={activity} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>

          {/* Budget Breakdown */}
          <Typography variant="h5" gutterBottom>
            Budget Breakdown
          </Typography>
          <Paper
            elevation={1}
            sx={{ p: 2, mb: 4, bgcolor: "background.default" }}
          >
            <Grid container spacing={2}>
              {Object.entries(itinerary?.itinerary.total).map(
                ([category, amount]) => (
                  <Grid item xs={12} sm={6} md={4} key={category}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {category}:
                      </Typography>
                      <Typography variant="body1">
                        ₹{amount.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Paper>

          {/* Travel Tips */}
          <Typography variant="h5" gutterBottom>
            Travel Tips
          </Typography>
          <Paper elevation={1} sx={{ p: 2, bgcolor: "background.default" }}>
            <List>
              {itinerary?.itinerary.tips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TipsAndUpdatesIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Paper>
      </Container>
    </>
  );
};

export default Itinerary;
