import React, { useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const ItineraryList = ({
  itineraries,
  isLoading,
  onDelete,
  capitalizeWords,
}) => {
  let theme = useTheme();
  let isDark = theme.palette.mode === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (Array.isArray(itineraries) && itineraries.length > 0) {
      setCurrentIndex(0);
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % itineraries.length);
      }, 2000); // Change slide every 3 seconds
      return () => clearInterval(interval);
    }
  }, [itineraries]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <ListAltIcon color="primary" />
        <Typography variant="h6">Saved Itineraries</Typography>
      </Stack>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      ) : Array.isArray(itineraries) && itineraries.length > 0 ? (
        <List>
          <ListItem
            key={`itinerary-${itineraries[currentIndex]._id || currentIndex}`}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: isDark ? "background.paper" : "background.default",
              "&:hover": {
                bgcolor: isDark ? "action.selected" : "action.hover",
              },
              p: 0, // Remove default padding
              transition: "all 0.5s",
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(itineraries[currentIndex]._id)}
                color="error"
                sx={{
                  color: isDark ? "error.light" : "error.main",
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Link
              to={`/itineraries/${itineraries[currentIndex]._id}`}
              style={{
                textDecoration: "none",
                color: isDark ? "text.primary" : "inherit",
                width: "100%",
                padding: "8px 48px 8px 16px", // Compensate for secondaryAction
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                    {capitalizeWords(itineraries[currentIndex]?.location) ||
                      "No Location"}
                  </Typography>
                }
                secondary={
                  <Stack spacing={0.5} mt={1}>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <FlightTakeoffIcon sx={{ mr: 1, fontSize: "small" }} />
                      {capitalizeWords(itineraries[currentIndex]?.travelType) ||
                        "No Type"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DateRangeIcon sx={{ mr: 1, fontSize: "small" }} />
                      {itineraries[currentIndex]?.startDate &&
                      itineraries[currentIndex]?.endDate
                        ? `${format(
                            new Date(itineraries[currentIndex].startDate),
                            "dd MMM yyyy"
                          )} to ${format(
                            new Date(itineraries[currentIndex].endDate),
                            "dd MMM yyyy"
                          )}`
                        : "No Date"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CurrencyRupeeIcon sx={{ mr: 1, fontSize: "small" }} />
                      {Number(itineraries[currentIndex]?.budget).toLocaleString(
                        "en-IN"
                      ) || "0"}
                    </Typography>
                  </Stack>
                }
              />
            </Link>
          </ListItem>
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography color="text.secondary">No itineraries found.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ItineraryList;
