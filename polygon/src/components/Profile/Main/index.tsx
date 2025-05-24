'use client';

import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  Skeleton,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { User } from 'features/user/type';
import { useParams } from 'next/navigation';
import { UserApi } from 'features/user/api';

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
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserApi.getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
              <Stack spacing={3}>
                <Skeleton height={40} />
                <Divider />
                <Skeleton height={60} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        <Typography color="error">{error || 'User not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 4, md: 6 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 2,
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn color="action" />
                <Typography>{user.country || '_'}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 1 }}
                >
                  Rating
                </Typography>
                <Chip
                  label={user.rating}
                  sx={{
                    backgroundColor: getRatingColor(user.rating),
                    color: 'white',
                    fontWeight: 'bold',
                    px: 2,
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 1 }}
                >
                  Contributions
                </Typography>
                <Chip
                  label={user.contribute || 0}
                  color="primary"
                  sx={{
                    px: 2,
                  }}
                />
              </Box>
              {(user.firstname || user.lastname) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Full Name
                  </Typography>
                  <Typography>
                    {[user.firstname, user.lastname].filter(Boolean).join(' ')}
                  </Typography>
                </Box>
              )}
              {user.description && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    About
                  </Typography>
                  <Typography>{user.description}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
