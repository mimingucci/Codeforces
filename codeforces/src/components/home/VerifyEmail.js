import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserApi from "../../getApi/UserApi";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        setVerifying(true);
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
          setError(t("verifyEmail.noToken"));
          setVerifying(false);
          return;
        }

        const response = await UserApi.verifyEmail(token);

        if (response?.data?.code === "200") {
          setSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setError(
            response?.data?.message || t("verifyEmail.verificationFailed")
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.message) {
          setError(error.message);
        } else {
          setError(t("verifyEmail.linkExpired"));
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyEmailToken();
  }, [location.search, navigate, t]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          {t("verifyEmail.title")}
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
              {t("verifyEmail.verifying")}
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>
              {t("verifyEmail.pleaseWait")}
            </Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle sx={{ color: "success.main", fontSize: 80, mb: 3 }} />
            <Typography variant="h5" align="center" gutterBottom>
              {t("verifyEmail.successTitle")}
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t("verifyEmail.successMessage")}
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t("verifyEmail.redirecting")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGoToLogin}
            >
              {t("verifyEmail.goToLogin")}
            </Button>
          </>
        ) : (
          <>
            <Error sx={{ color: "error.main", fontSize: 80, mb: 3 }} />
            <Typography variant="h5" align="center" gutterBottom>
              {t("verifyEmail.failedTitle")}
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                {t("verifyEmail.tryAgain")}
              </Button>
              <Button variant="contained" onClick={handleGoToLogin}>
                {t("verifyEmail.backToLogin")}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("verifyEmail.support")}
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
