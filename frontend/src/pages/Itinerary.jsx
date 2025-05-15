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

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            {itinerary.location}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <FlightTakeoffIcon sx={{ mr: 1 }} /> Travel Type:{" "}
                {itinerary.travelType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <DateRangeIcon sx={{ mr: 1 }} /> Dates:{" "}
                {format(new Date(itinerary.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(itinerary.endDate), "MMM dd, yyyy")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <CurrencyRupeeIcon sx={{ mr: 1 }} /> Budget: ₹{itinerary.budget}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Daily Plans
          </Typography>
          <List>
            {itinerary.itinerary.days.map((day, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Date: ${day.date}`}
                  secondary={`Plan: ${day.plan.join(", ")}`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {/* {itinerary.itinerary.mustTry &&
            itinerary.itinerary.mustTry.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Must Try
                </Typography>
                <List>
                  {itinerary.itinerary.mustTry
                    .slice(0, 3)
                    .map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )} */}
          <Typography variant="h6" gutterBottom>
            Tips
          </Typography>
          <List>
            {itinerary.itinerary.tips &&
              itinerary.itinerary.tips.slice(0, 3).map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TipsAndUpdatesIcon />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
          </List>
          {/* <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Guidelines
          </Typography>
          <List>
            {itinerary.itinerary.guidelines &&
              itinerary.itinerary.guidelines.slice(0, 3).map((guide, index) => (
                <ListItem key={index}>
                  <ListItemText primary={guide} />
                </ListItem>
              ))}
          </List> */}
        </Paper>
      </Container>
    </>
  );
};

export default Itinerary;
