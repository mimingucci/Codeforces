import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

export default function Processing() {
  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          background: 'linear-gradient(to bottom right, #f5f5f5, #ffffff)',
        }}
      >
        <Box
          sx={{
            animation: `${bounce} 2s infinite ease-in-out`,
            mb: 3,
          }}
        >
          <ConstructionIcon
            sx={{
              fontSize: 80,
              color: 'warning.main',
              mb: 2,
            }}
          />
        </Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2, #ff9800)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Under Construction
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          We&apos;re working hard to bring you an amazing problem management
          experience. Please check back soon!
        </Typography>
        <CircularProgress
          size={30}
          thickness={4}
          sx={{
            color: (theme) => theme.palette.warning.main,
          }}
        />
      </Paper>
    </Box>
  );
}
