import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Error, MarkEmailRead } from "@mui/icons-material";

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        setVerifying(true);

        // Extract token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
          setError("Invalid verification link. No token found.");
          setVerifying(false);
          return;
        }

        // Call API to verify email
        const response = await UserApi.verifyEmail(token);

        if (response?.data?.code === "200") {
          setSuccess(true);
          // Auto redirect to login after 5 seconds
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setError(
            response?.data?.message ||
              "Email verification failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.message) {
          setError(error.message);
        } else {
          setError(
            "Email verification failed. The link may have expired or is invalid."
          );
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyEmailToken();
  }, [location.search, navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Email Verification
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "250px",
          justifyContent: "center",
        }}
      >
        {verifying ? (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" align="center">
              Verifying your email...
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>
              Please wait while we verify your email address
            </Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle sx={{ color: "success.main", fontSize: 80, mb: 3 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              Your account has been activated. You can now log in.
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              Redirecting to login page in 5 seconds...
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGoToLogin}
            >
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <Error sx={{ color: "error.main", fontSize: 80, mb: 3 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Verification Failed
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button variant="contained" onClick={handleGoToLogin}>
                Back to Login
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          If you're having trouble verifying your email, please contact our
          support team.
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
