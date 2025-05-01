'use client';

import { Box, Avatar, Typography, Stack } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { AccountCircle as DefaultAvatar } from '@mui/icons-material';

// Mock user data
const mockUser = {
  username: 'Jiangly',
  avatar: null, // Set to null to test default avatar
  registeredAt: '2025-05-01T00:00:00Z',
  rating: 3200,
};

const getRatingColor = (rating: number): string => {
  if (rating >= 3000) return '#FF0000';
  if (rating >= 2600) return '#FFA500';
  if (rating >= 2200) return '#FFFF00';
  return '#808080';
};

export default function ProfileHeader() {
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
        {mockUser.avatar ? (
          <Avatar
            src={mockUser.avatar}
            alt={mockUser.username}
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
            {mockUser.username}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Member since {format(parseISO(mockUser.registeredAt), 'MMMM yyyy')}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
