'use client';

import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

// Mock user data
const mockUser = {
  rating: 3200,
  maxRating: 3250,
  country: 'China',
  contributions: 523,
};

const getRatingColor = (rating: number): string => {
  if (rating >= 3000) return '#FF0000';
  if (rating >= 2600) return '#FFA500';
  if (rating >= 2200) return '#FFFF00';
  return '#808080';
};

export default function ProfileMain() {
  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
      {' '}
      {/* Added responsive horizontal padding */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 4, // Increased padding from 3 to 4
              borderRadius: 2, // Added rounded corners for better aesthetics
            }}
          >
            <Stack spacing={3}>
              {' '}
              {/* Increased spacing from 2 to 3 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {' '}
                {/* Increased gap from 1 to 2 */}
                <LocationOn color="action" />
                <Typography>{mockUser.country}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 1 }} // Added margin bottom for better spacing
                >
                  Rating
                </Typography>
                <Chip
                  label={`${mockUser.rating} (max: ${mockUser.maxRating})`}
                  sx={{
                    backgroundColor: getRatingColor(mockUser.rating),
                    color: 'white',
                    fontWeight: 'bold',
                    px: 2, // Added horizontal padding to chip
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
