import React, { useState } from "react";
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
  Modal,
  Backdrop,
  Fade,
  TextField,
} from "@mui/material";
import { AddBox, Notifications, Logout } from "@mui/icons-material";
import { FaUserCircle } from "react-icons/fa";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Content from "./DashBoard/Content";
import Addproject from "./DashBoard/Addproject";

const drawerWidth = 200;

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddProject = () => {
    // Implement your logic here to handle adding a project
    console.log("Adding a project...");
    handleCloseModal(); // Close the modal after adding the project
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
          <Avatar sx={{ mx: 2 }}>
            <FaUserCircle />
          </Avatar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Username
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2 }}></Typography>
          <Button color="inherit" startIcon={<Logout />}>
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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Content />
      </Box>

      
      <Addproject
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleAddProject={handleAddProject}
      />
    </Box>
  );
}

export default Dashboard;
