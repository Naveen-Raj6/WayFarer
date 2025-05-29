import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";

import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import logo from "../assets/logo.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../context/AuthContext";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import axios from "../utils/axios";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "../context/ThemeContext"; // Import your custom theme hook
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const settings = ["Profile", "Logout"];

const UploadButton = styled(Button)({
  marginTop: "1rem",
});

const modalStyle = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
});

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { token, user, setUser, logout } = useAuth();
  const muiTheme = useMuiTheme(); // MUI theme
  const { darkMode, toggleTheme } = useTheme(); // Your custom theme hook
  let navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    setOpenModal(true);
  };

  const handleLogout = () => {
    logout(); // This will clear token and user from context
    handleCloseUserMenu();
    navigate("/login");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    let formData = new FormData();
    formData.append("displayPicture", selectedFile);
    try {
      let res = await axios.put(`/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res);

      setUser(res.data);
      setOpenModal(false);
      setSelectedImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
    }
  };

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
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const snackbarKey = enqueueSnackbar(
      "Are you sure you want to cancel your subscription?",
      {
        variant: "warning",
        persist: true,
        action: (
          snackbarKey // Change 'key' to 'snackbarKey' for clarity
        ) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              aria-label="confirm cancel"
              color="inherit"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await axios.post(
                    "/stripe/cancel-subscription",
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  const updatedUser = { ...user, isSubscribed: false };
                  setUser(updatedUser);
                  closeSnackbar(snackbarKey); // Close confirmation snackbar first
                  enqueueSnackbar("Subscription cancelled successfully", {
                    variant: "success",
                    autoHideDuration: 3000,
                  });
                  navigate("/home");
                } catch (error) {
                  closeSnackbar(snackbarKey); // Close confirmation snackbar on error
                  enqueueSnackbar("Failed to cancel subscription", {
                    variant: "error",
                    autoHideDuration: 3000,
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="cancel"
              color="inherit"
              onClick={() => closeSnackbar(snackbarKey)} // Use snackbarKey directly
            >
              <CancelIcon />
            </IconButton>
          </Box>
        ),
      }
    );
  };

  React.useEffect(() => {
    // Refetch user data on mount and when route changes
    const fetchUser = async () => {
      if (token && user?._id) {
        try {
          const res = await axios.get(`/users/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          // Optionally handle error
        }
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <img src={logo} alt="logo" style={{ height: "50px" }} />
            </Link>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  ml: 1,
                  color: "text.primary",
                }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Box
                sx={{
                  flexGrow: 0,
                  gap: "1em",
                  display: { md: "flex", alignItems: "center" },
                }}
              >
                {token ? (
                  <>
                    {/* Add Subscription Button */}
                    {user?.isSubscribed ? (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelSubscription}
                        disabled={isLoading}
                        sx={{ mr: 2 }}
                      >
                        {isLoading ? "Processing..." : "Cancel Premium"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PaymentIcon />}
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        sx={{ mr: 2 }}
                      >
                        {isLoading ? "Processing..." : "Upgrade to Premium"}
                      </Button>
                    )}

                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="User Avatar" src={user?.displayPicture} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting}
                          onClick={
                            setting === "Profile"
                              ? handleProfileClick
                              : setting === "Logout"
                              ? handleLogout
                              : handleCloseUserMenu
                          }
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            {setting}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Box
                    sx={{ display: "flex", gap: "1em", alignItems: "center" }}
                  >
                    <Link
                      to="/login"
                      style={{
                        textDecoration: "none",
                        color: muiTheme.palette.primary.main,
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: "none",
                        color: muiTheme.palette.primary.contrastText,
                        backgroundColor: muiTheme.palette.primary.main,
                        padding: "0.5em 1em",
                        borderRadius: "8px",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: muiTheme.palette.primary.dark,
                        },
                      }}
                    >
                      Signup
                    </Link>
                  </Box>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="profile-modal-title"
      >
        <Box sx={modalStyle(muiTheme)}>
          <Typography
            id="profile-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Update Profile Picture
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="Preview"
              src={selectedImage}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-image-upload">
              <Button variant="contained" component="span">
                Choose Image
              </Button>
            </label>

            <UploadButton
              variant="contained"
              color="primary"
              disabled={!selectedImage}
              onClick={uploadImage}
            >
              Upload
            </UploadButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
export default Navbar;
