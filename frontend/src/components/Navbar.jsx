import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import { Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "../utils/axios";
import { Fragment } from "react";

const settings = ["Profile", "Logout"];

const UploadButton = styled(Button)({
  marginTop: "1rem",
});

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { token, user, setUser, logout } = useAuth();
  let navigate = useNavigate();

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

  return (
    <Fragment>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img src={logo} alt="logo" style={{ height: "50px" }} />
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            <Box
              sx={{
                flexGrow: 0,
                gap: "1em",
                display: { md: "flex", alignItems: "center" },
              }}
            >
              {token ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src={user?.displayPicture} />
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
                <>
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      backgroundColor: "green",
                      padding: "0.5em 1em",
                      borderRadius: "8px",
                    }}
                  >
                    Signup
                  </Link>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="profile-modal-title"
      >
        <Box sx={modalStyle}>
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
    </Fragment>
  );
}
export default Navbar;
