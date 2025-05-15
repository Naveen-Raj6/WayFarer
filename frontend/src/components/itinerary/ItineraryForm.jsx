import React from "react";
import {
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocationAutocomplete from "./LocationAutocomplete";
import DateRangePicker from "./DateRangePicker";

const ItineraryForm = ({
  formData,
  query,
  suggestions,
  activeIndex,
  onSubmit,
  onInputChange,
  onLocationChange,
  onLocationSelect,
  onKeyDown,
  suggestionStyles,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <TravelExploreIcon color="primary" />
        <Typography variant="h6">Create Itinerary</Typography>
      </Stack>

      <form onSubmit={onSubmit} autoComplete="off">
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel id="travel-type-label">
            <FlightTakeoffIcon sx={{ mr: 1, fontSize: "small" }} />
            Travel Type
          </InputLabel>
          <Select
            labelId="travel-type-label"
            label="Travel Type"
            name="travelType"
            value={formData.travelType}
            onChange={onInputChange}
            required
          >
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="leisure">Leisure</MenuItem>
            <MenuItem value="adventure">Adventure</MenuItem>
            <MenuItem value="family">Family</MenuItem>
            <MenuItem value="friends">Friends</MenuItem>
            <MenuItem value="couple">Couple</MenuItem>
            <MenuItem value="solo">Solo</MenuItem>
          </Select>
        </FormControl>

        <LocationAutocomplete
          query={query}
          suggestions={suggestions}
          activeIndex={activeIndex}
          onChange={onLocationChange}
          onSelect={onLocationSelect}
          onKeyDown={onKeyDown}
          suggestionStyles={suggestionStyles}
        />

        <DateRangePicker
          startDate={formData.startDate}
          endDate={formData.endDate}
          onChange={onInputChange}
        />

        <TextField
          fullWidth
          size="small"
          label="Budget"
          name="budget"
          type="number"
          value={formData.budget}
          onChange={onInputChange}
          required
          InputProps={{
            startAdornment: (
              <CurrencyRupeeIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
          sx={{ mt: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          color={"primary"}
          disabled={
            !formData.location || !formData.startDate || !formData.endDate
          }
          fullWidth
          sx={{ mt: 2 }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Create Itinerary
        </Button>
      </form>
    </Paper>
  );
};

export default ItineraryForm;
