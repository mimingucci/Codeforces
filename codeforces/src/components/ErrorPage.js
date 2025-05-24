import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import codeforcesLogo from "../assets/image/code-forces.svg";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Box
          component="img"
          src={codeforcesLogo}
          alt="Codeforces Logo"
          sx={{
            width: "120px",
            height: "120px",
            mb: 2,
          }}
        />
        
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "4rem", md: "6rem" },
            fontWeight: "bold",
            color: "primary.main",
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: "text.secondary",
            mb: 2,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "500px",
            mb: 4,
          }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem",
          }}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;