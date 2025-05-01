'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Image
          src="/images/topcoder1.svg" // Make sure to add your logo file in the public directory
          alt="Polygon"
          width={200}
          height={100}
          priority
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', sm: '8rem' },
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" color="text.secondary" gutterBottom>
          Oops! Page not found
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/')}
          sx={{
            mt: 2,
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
}
