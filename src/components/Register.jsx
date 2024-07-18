import React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Divider,
  Paper,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import registerImg from "../assets/Register_page_img.png";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/Firebase.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword(password, confirmPassword)) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAlert({
        message: "User registered successfully redirecting to login",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setOpen(true);
    } catch (error) {
      setAlert({
        message: `Error in registration: ${error.message}`,
        severity: "error",
      });
      setOpen(true);
    }
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6) {
      setAlert({
        message: "Password must be at least 6 characters",
        severity: "error",
      });
      setOpen(true);
      return false;
    }
    if (password !== confirmPassword) {
      setAlert({ message: "Passwords do not match", severity: "error" });
      setOpen(true);
      return false;
    }
    return true;
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      setAlert({
        message: "User registered successfully redirecting to home page",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setOpen(true);
    } catch (error) {
      setAlert({
        message: `Error in registration: ${error.message}`,
        severity: "error",
      });
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{ display: "flex", borderRadius: "12px", overflow: "hidden" }}
        >
          <Box sx={{ flex: 1, padding: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="h4" align="left">
                  Register ✌🏻
                </Typography>
                <Typography variant="body2" color="textSecondary" align="left">
                  Get started with Task Management App
                </Typography>
              </Box>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="text"
                  autoComplete="true"
                  autoFocus
                  InputProps={{
                    style: { borderRadius: 16 },
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    style: { borderRadius: 16 },
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    style: { borderRadius: 16 },
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    style: { borderRadius: 16 },
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Grid container>
                  <Grid item xs>
                    <Link
                      href="/login"
                      sx={{
                        color: "gray",
                        textDecoration: "none",
                        "&:hover": {
                          cursor: "pointer",
                          color: "#1976d2",
                        },
                      }}
                    >
                      <Typography align="center" variant="body2" gutterBottom>
                        Have an account? Login now
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, borderRadius: "16px" }}
                  onClick={handleSubmit}
                >
                  Register
                </Button>
                <Divider sx={{ my: 2 }}>Or</Divider>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <IconButton onClick={handleGoogleSignIn}>
                    <FcGoogle />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "30vw",
            }}
          >
            <img
              src={registerImg}
              alt="Login"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        </Paper>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={alert.severity}
            variant="filled"
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default Register;
