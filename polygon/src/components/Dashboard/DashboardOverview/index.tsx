import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
  Code as CodeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { blue, green, orange, purple } from '@mui/material/colors';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User } from 'features/user/type';
import { UserApi } from 'features/user/api';
import { format } from 'date-fns';
import { convertUnixFormatToDate } from 'utils/date';

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
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const userData = await UserApi.getUser(session.user.id);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

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

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Skeleton variant="circular" width={80} height={80} />
            </Grid>
            <Grid item xs>
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton variant="text" width={200} height={24} />
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
              src={user?.avatar}
              sx={{ width: 80, height: 80, border: '3px solid white' }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.username}!
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="subtitle1">
                Rating: {user?.rating || 0}
              </Typography>
              <Typography variant="subtitle1">
                Contributions: {user?.contribute || 0}
              </Typography>
              <Typography variant="subtitle2">
                Member since:{' '}
                {format(
                  convertUnixFormatToDate(user?.createdAt || ''),
                  'MMMM yyyy'
                )}
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
