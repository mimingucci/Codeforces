import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  Link,
  Divider,
} from '@mui/material';
import { FaArrowRightLong, FaClock } from 'react-icons/fa6';

const NavbarClock = () => {
  const [nextContest, setNextContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);

  // Fake API call - replace with your actual API
  const fetchNextContest = async () => {
    try {
      // Simulate API call
      const response = {
        data: {
          id: 1,
          title: "Educational Codeforces Round 123",
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          duration: "2:00"
        }
      };
      setNextContest(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch next contest:", error);
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!nextContest) return {};

    const startTime = new Date(nextContest.startTime);
    const difference = startTime - new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  };

  useEffect(() => {
    fetchNextContest();
  }, []);

  useEffect(() => {
    if (!nextContest) return;

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      if (timeLeft) {
        setTimeLeft(timeLeft);
      } else {
        clearInterval(timer);
        fetchNextContest(); // Fetch next contest when current one starts
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextContest]);

  if (!nextContest) return null;

  return (
    <Paper 
      elevation={1}
      sx={{ 
        mt: 2,
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1.5,
        bgcolor: 'action.hover'
      }}>
        <FaArrowRightLong style={{ color: '#1976d2', marginRight: 8 }} />
        <Typography color="primary" variant="subtitle1">
          Pay attention
        </Typography>
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FaClock style={{ color: '#1976d2' }} />
          <Typography variant="subtitle2">
            Next Contest:
          </Typography>
        </Box>

        <Link
          href={`/contest/${nextContest.id}`}
          underline="hover"
          color="inherit"
          sx={{ 
            display: 'block',
            mb: 2,
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          {nextContest.title}
        </Link>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'action.hover',
          borderRadius: 1
        }}>
          {Object.entries(timeLeft).map(([unit, value]) => (
            <Box 
              key={unit}
              sx={{ 
                textAlign: 'center',
                minWidth: 60
              }}
            >
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                {String(value).padStart(2, '0')}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ textTransform: 'uppercase' }}
              >
                {unit}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            display: 'block',
            textAlign: 'center',
            mt: 1
          }}
        >
          Duration: {nextContest.duration} hours
        </Typography>
      </Box>
    </Paper>
  );
};

export default NavbarClock;