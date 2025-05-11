import { useState } from "react";
import UserApi from "../../getApi/UserApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

const SignUp = () => {
  // Form fields state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  // Validation errors state
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else {
      newErrors.username = "";
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await UserApi.signup(email, username, password);

      if (res.data && res.data.code === "200") {
        setSuccess(true);
        // Clear form fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(
          res.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="primary"
          fontWeight="500"
        >
          Create Your Account
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
        >
          Join Codeforces to start solving problems and participating in
          contests!
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Success message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Account created successfully!
            </Typography>
            <Typography variant="body2">
              Please check your email to verify your account before logging in.
            </Typography>
          </Alert>
        )}

        {/* Error message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {!success && (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            {/* Email field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            {/* Password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            {/* Confirm Password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
            />

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Login link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <RouterLink
                  to="/login"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Sign In
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Account successfully created */}
      {success && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/login"
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SignUp;
