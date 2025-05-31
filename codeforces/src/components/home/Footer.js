import { Box, Typography, Container, Link, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import openai from "../../assets/image/openai.jpg";
import microsoft from "../../assets/image/microsoft.jpg";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center">
          <Typography variant="body1">
            <Link
              href="http://localhost:3000/"
              underline="hover"
              color="inherit"
            >
              Codeforces
            </Link>{" "}
            {t("footer.copyright")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("footer.platform")}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("footer.supportedBy")}
          </Typography>

          <Stack direction="row" spacing={4} alignItems="center" sx={{ mt: 2 }}>
            <Link
              href="https://openai.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box
                component="img"
                src={openai}
                alt="OpenAI"
                sx={{
                  width: 160,
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            </Link>
            <Link
              href="https://www.microsoft.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box
                component="img"
                src={microsoft}
                alt="Microsoft"
                sx={{
                  width: 80,
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
export default Footer;
