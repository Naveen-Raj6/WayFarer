import React from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationAutocomplete = ({
  query,
  suggestions,
  activeIndex,
  onChange,
  onKeyDown,
  onSelect,
  suggestionStyles,
}) => {
  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <TextField
        fullWidth
        size="small"
        label="Location"
        name="location"
        value={query}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required
        InputProps={{
          startAdornment: (
            <LocationOnIcon sx={{ mr: 1, color: "action.active" }} />
          ),
        }}
      />
      {suggestions.length > 0 && (
        <Paper sx={suggestionStyles}>
          <List dense>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                selected={index === activeIndex}
                onClick={() => onSelect(suggestion)}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default LocationAutocomplete;
