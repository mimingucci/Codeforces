import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
  Code as CodeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { blue, green, orange, purple } from '@mui/material/colors';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, title, value, color }: StatCardProps) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      background: `linear-gradient(45deg, ${color}, ${color}dd)`,
      color: 'white',
    }}
  >
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Stack>
  </Paper>
);

export default function DashboardOverview() {
  // Mock user data - replace with actual data from your auth system
  const user = {
    name: 'Jiangly',
    role: 'ADMIN',
    avatar: '/path/to/avatar.jpg',
    rating: 3200,
    lastActive: '2 hours ago',
  };

  // Mock statistics - replace with actual data
  const stats = [
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'Total Users',
      value: '15.2K',
      color: blue[500],
    },
    {
      icon: <TrophyIcon fontSize="large" />,
      title: 'Active Contests',
      value: '12',
      color: orange[500],
    },
    {
      icon: <CodeIcon fontSize="large" />,
      title: 'Total Problems',
      value: '856',
      color: green[600],
    },
    {
      icon: <AssessmentIcon fontSize="large" />,
      title: 'Submissions Today',
      value: '2.4K',
      color: purple[500],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(120deg, ${blue[700]}, ${blue[900]})`,
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={user.avatar}
              sx={{ width: 80, height: 80, border: '3px solid white' }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user.name}!
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={user.role}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Typography variant="subtitle1">Rating: {user.rating}</Typography>
              <Typography variant="subtitle2">
                Last active: {user.lastActive}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Recent Activity
        </Typography>
        {/* Add your activity feed component here */}
      </Paper>
    </Box>
  );
}
