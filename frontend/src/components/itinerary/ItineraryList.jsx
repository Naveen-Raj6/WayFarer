import React from "react";
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
          {itineraries.map((itinerary, index) => (
            <ListItem
              key={`itinerary-${itinerary._id || index}`}
              sx={{
                borderRadius: 1,
                mb: 1,
                bgcolor: isDark ? "background.paper" : "background.default",
                "&:hover": {
                  bgcolor: isDark ? "action.selected" : "action.hover",
                },
                p: 0, // Remove default padding
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(itinerary._id)}
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
                to={`/itineraries/${itinerary._id}`}
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
                      {capitalizeWords(itinerary?.location) || "No Location"}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={0.5} mt={1}>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <FlightTakeoffIcon sx={{ mr: 1, fontSize: "small" }} />
                        {capitalizeWords(itinerary?.travelType) || "No Type"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <DateRangeIcon sx={{ mr: 1, fontSize: "small" }} />
                        {itinerary?.startDate && itinerary?.endDate
                          ? `${format(
                              new Date(itinerary.startDate),
                              "dd MMM yyyy"
                            )} to ${format(
                              new Date(itinerary.endDate),
                              "dd MMM yyyy"
                            )}`
                          : "No Date"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <CurrencyRupeeIcon sx={{ mr: 1, fontSize: "small" }} />₹
                        {Number(itinerary?.budget).toLocaleString("en-IN") ||
                          "0"}
                      </Typography>
                    </Stack>
                  }
                />
              </Link>
            </ListItem>
          ))}
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
