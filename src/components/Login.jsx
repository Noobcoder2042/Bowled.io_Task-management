import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import loginImg from "../assets/Login_page_img.png";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/Firebase.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateCredentials()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/");
    } catch (error) {
      setAlert({ message: `Error: ${error.message}`, severity: "error" });
      setOpen(true);
    }
  };

  const validateCredentials = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: "Invalid email format", severity: "error" });
      setOpen(true);
      return false;
    }
    if (password.length < 6) {
      setAlert({
        message: "Password must be at least 6 characters",
        severity: "error",
      });
      setOpen(true);
      return false;
    }

    return true;
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      setAlert({
        message: "User login successfully redirecting to home page",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setOpen(true);
    } catch (error) {
      setAlert({
        message: `Error in login: ${error.message}`,
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
    <div>
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
                  Login ✌️
                </Typography>
                <Typography variant="body2" color="textSecondary" align="left">
                  How do I get started with Task Management App ?
                </Typography>
              </Box>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  fullWidth
                  variant="outlined"
                  startIcon={<FcGoogle />}
                  sx={{ mt: 3, mb: 3, borderRadius: "16px" }}
                >
                  Sign in with Google
                </Button>
                <Divider sx={{ my: 2 }}>or Sign in with Email</Divider>
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
                <Grid container>
                  <Grid item xs>
                    <Link
                      href="/register"
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
                        Don't have an account? Register now
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, borderRadius: "16px" }}
                >
                  Login
                </Button>
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
              src={loginImg}
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
    </div>
  );
}

export default Login;
