import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Box, Container, Typography, Button, Stack } from '@mui/material';

export default function Page() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Makes the box take full viewport height
      }}
    >
      <Header />

      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Polygon
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            Create, manage, and participate in programming contests with our
            powerful platform designed for competitive programming.
          </Typography>

          <Button
            variant="contained"
            size="large"
            href="/contests"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}
