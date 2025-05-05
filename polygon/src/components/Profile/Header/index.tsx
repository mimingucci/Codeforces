'use client';

import { Box, Avatar, Typography, Stack, Skeleton } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { AccountCircle as DefaultAvatar } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { User } from 'features/user/type';
import { UserApi } from 'features/user/api';
import { useParams } from 'next/navigation';

export default function ProfileHeader() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTimestamp = (timestamp: string) => {
    // Split into seconds and nanoseconds
    const [seconds, nanos] = timestamp.split('.');
    // Convert seconds to milliseconds and create Date
    const date = new Date(parseInt(seconds) * 1000);
    return format(date, 'MMMM yyyy');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserApi.getUser(userId);
        console.log('Fetched user:', userData);
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
      <Box sx={{ height: 200, bgcolor: 'grey.900' }}>
        <Stack direction="row" spacing={3} sx={{ p: 3 }}>
          <Skeleton variant="circular" width={150} height={150} />
          <Stack spacing={1} sx={{ pt: 2 }}>
            <Skeleton variant="text" width={200} height={60} />
            <Skeleton variant="text" width={150} height={30} />
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ height: 200, bgcolor: 'grey.900' }}>
        <Typography color="error" sx={{ p: 3 }}>
          {error || 'User not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: 200,
        backgroundImage: 'url(/assets/profile-header-bg.png)', // Add your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 3,
          color: 'white',
        }}
      >
        {user.avatar ? (
          <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{
              width: 150,
              height: 150,
              border: `7px solid`,
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: `7px solid`,
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              bgcolor: 'grey.300',
            }}
          >
            <DefaultAvatar sx={{ width: 80, height: 80 }} />
          </Avatar>
        )}

        <Stack spacing={1}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {user.username}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Member since {formatTimestamp(user.createdAt)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
