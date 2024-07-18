import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddBox, Notifications, Logout } from "@mui/icons-material";
import { FaUserCircle } from "react-icons/fa";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Content from "./DashBoard/Content";
import Addproject from "./DashBoard/Addproject";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const drawerWidth = 200;

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddProject = () => {
    handleCloseModal();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAlert({
        message: "User signed out successfully",
        severity: "success",
      });
      setOpenAlert(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setAlert({
        message: `Error signing out: ${error.message}`,
        severity: "error",
      });
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgb(62, 15, 154)",
        }}
      >
        <Toolbar>
          <Avatar sx={{ mx: 2 }} src={user?.photoURL}>
            {user?.photoURL ? null : <FaUserCircle />}
          </Avatar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {user?.displayName || "Username"}
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2 }}></Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "rgba(3, 2, 33, 1)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem
              button
              onClick={() => {}}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "#0175f9",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", my: 1 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              onClick={handleOpenModal}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "#0175f9",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", my: 1 }}>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary="Add Project" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box sx={{ width: "100%" }}>
        <Content />
      </Box>

      <Addproject
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleAddProject={handleAddProject}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
