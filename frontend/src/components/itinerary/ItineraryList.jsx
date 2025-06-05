import React, { useEffect, useState } from "react";
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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (!Array.isArray(itineraries) || itineraries.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === itineraries.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [itineraries, current]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? itineraries.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev === itineraries.length - 1 ? 0 : prev + 1));
  };

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <ListAltIcon color="primary" />
        <Typography variant="h6">Saved Itineraries</Typography>
      </Stack>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      ) : Array.isArray(itineraries) && itineraries.length > 0 ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton onClick={handlePrev} aria-label="Previous">
              {/* <ListAltIcon sx={{ transform: "rotate(90deg)" }} /> */}
              <ArrowBackIosNewIcon />
            </IconButton>
            <Box sx={{ flex: 1, mx: 2 }}>
              {/* Show only the current itinerary */}
              <List>
                <ListItem
                  key={`itinerary-${itineraries[current]._id || current}`}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: isDark ? "background.paper" : "background.default",
                    "&:hover": {
                      bgcolor: isDark ? "action.selected" : "action.hover",
                    },
                    p: 0,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(itineraries[current]._id)}
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
                    to={`/itineraries/${itineraries[current]._id}`}
                    style={{
                      textDecoration: "none",
                      color: isDark ? "text.primary" : "inherit",
                      width: "100%",
                      padding: "8px 48px 8px 16px",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <LocationOnIcon
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                          {capitalizeWords(itineraries[current]?.location) ||
                            "No Location"}
                        </Typography>
                      }
                      secondary={
                        <Stack spacing={0.5} mt={1}>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <FlightTakeoffIcon
                              sx={{ mr: 1, fontSize: "small" }}
                            />
                            {capitalizeWords(
                              itineraries[current]?.travelType
                            ) || "No Type"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <DateRangeIcon sx={{ mr: 1, fontSize: "small" }} />
                            {itineraries[current]?.startDate &&
                            itineraries[current]?.endDate
                              ? `${format(
                                  new Date(itineraries[current].startDate),
                                  "dd MMM yyyy"
                                )} to ${format(
                                  new Date(itineraries[current].endDate),
                                  "dd MMM yyyy"
                                )}`
                              : "No Date"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <CurrencyRupeeIcon
                              sx={{ mr: 1, fontSize: "small" }}
                            />
                            ₹
                            {Number(
                              itineraries[current]?.budget
                            ).toLocaleString("en-IN") || "0"}
                          </Typography>
                        </Stack>
                      }
                    />
                  </Link>
                </ListItem>
              </List>
            </Box>
            <IconButton onClick={handleNext} aria-label="Next">
              {/* <ListAltIcon sx={{ transform: "rotate(-90deg)" }} />
               */}
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="caption">
              {current + 1} / {itineraries.length}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography color="text.secondary">No itineraries found.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ItineraryList;
