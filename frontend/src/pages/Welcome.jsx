import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles"; // Use MUI theme hook
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TimelineIcon from "@mui/icons-material/Timeline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { blue } from "@mui/material/colors";

const featuredLocations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    localImage: "/src/assets/paris.jpg",
    description: "City of Love and Lights",
    alt: "Eiffel Tower at sunset in Paris",
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    localImage: "/src/assets/tokyo.jpg",
    description: "Where Tradition Meets Future",
    alt: "Tokyo cityscape with Mount Fuji",
  },
  {
    name: "New York, USA",
    image: "https://images.unsplash.com/photo-1522083165195-3424ed129620",
    localImage: "/src/assets/newyork.jpg",
    description: "The City That Never Sleeps",
    alt: "Manhattan skyline with Empire State Building",
  },
  {
    name: "Sydney, Australia",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    localImage: "/src/assets/sydney.jpg",
    description: "Harbor City Paradise",
    alt: "Sydney Opera House and Harbor Bridge",
  },
  {
    name: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    localImage: "/src/assets/dubai.jpg",
    description: "Modern Desert Miracle",
    alt: "Dubai skyline with Burj Khalifa",
  },
  {
    name: "Cape Town, South Africa",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    localImage: "/src/assets/dubai.jpg",
    description: "Where Nature Inspires Culture",
    alt: "aerial-view-of-city-near-mountain",
  },
];

const features = [
  {
    icon: <FlightTakeoffIcon fontSize="large" />,
    title: "Smart Travel Planning",
    description: "AI-powered itinerary creation tailored to your preferences",
  },
  {
    icon: <LocationOnIcon fontSize="large" />,
    title: "Popular Destinations",
    description: "Explore top-rated locations around the world",
  },
  {
    icon: <TimelineIcon fontSize="large" />,
    title: "Customizable Schedules",
    description: "Flexible planning that fits your timeline",
  },
  {
    icon: <AttachMoneyIcon fontSize="large" />,
    title: "Budget Friendly",
    description: "Options for every budget range",
  },
];

const Welcome = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme(); // Get MUI theme
  const isDark = theme.palette.mode === "dark"; // Check if dark mode

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "70vh", md: "calc(100vh - 64px)" },
          backgroundImage: `linear-gradient(rgba(0, 0, 0, ${
            isDark ? "0.7" : "0.5"
          }), rgba(0, 0, 0, ${
            isDark ? "0.7" : "0.5"
          })), url('/src/assets/welcome.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", md: "3.75rem" } }}
              >
                Plan Your Perfect Journey
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Create custom travel itineraries for free with our AI-powered
                platform
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                startIcon={<ExploreIcon />}
                sx={{
                  bgcolor: "success.main",
                  "&:hover": { bgcolor: "success.dark" },
                  py: 1.5,
                  px: 4,
                }}
              >
                Start Planning
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: "background.default",
          color: "text.primary",
          borderTop: "4px solid #1976d2",
          borderBottom: "4px solid #1976d2",
        }}
      >
        <Container maxWidth="lg">
          {/* Main Heading */}
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Why Choose Wayfarer?
          </Typography>

          {/* New Subheading */}
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 5 }}
          >
            Smart Travel Planning, Popular Destinations, Customizable Schedules,
            Budget Friendly
          </Typography>

          {/* Feature Cards Grid */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    minHeight: 250,
                    bgcolor: "background.paper",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 3,
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        color: "primary.main",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 60,
                        fontSize: 40,
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Locations */}
      <Box
        sx={{
          py: 8,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Featured Destinations
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Create free itineraries for these popular locations
          </Typography>
          <Grid container spacing={3}>
            {featuredLocations.map((location, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={location.image}
                    alt={location.alt}
                    loading="lazy"
                    sx={{
                      bgcolor: "grey.300",
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          py: 6,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Wayfarer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your AI-powered travel companion for creating perfect
                itineraries. Plan your next adventure with ease.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Sign Up
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton color="primary">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="primary">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary">
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Wayfarer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;
