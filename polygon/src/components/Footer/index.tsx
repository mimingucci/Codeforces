'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Image
                src="/images/topcoder.svg"
                alt="Polygon"
                width={120}
                height={40}
                style={{ objectFit: 'contain' }}
              />
              <Typography variant="body2" color="text.secondary">
                A platform for managing programming contests and problems.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link href="/docs" color="inherit" underline="hover">
                Documentation
              </Link>
              <Link href="/api" color="inherit" underline="hover">
                API
              </Link>
              <Link href="/help" color="inherit" underline="hover">
                Help Center
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
              <Link href="/careers" color="inherit" underline="hover">
                Careers
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with the latest features and releases.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Polygon. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
