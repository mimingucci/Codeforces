import { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { differenceInSeconds } from 'date-fns';

const ContestTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        setStatus('Before');
        const diff = differenceInSeconds(start, now);
        setTimeLeft(formatTime(diff));
      } else if (now > end) {
        setStatus('Finished');
        setTimeLeft('00:00:00');
      } else {
        setStatus('Running');
        const diff = differenceInSeconds(end, now);
        setTimeLeft(formatTime(diff));
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getChipColor = () => {
    switch (status) {
      case 'Before': return 'warning';
      case 'Running': return 'success';
      case 'Finished': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip 
        label={status} 
        color={getChipColor()} 
        size="small" 
      />
      <Typography variant="h6" fontFamily="monospace">
        {timeLeft}
      </Typography>
    </Box>
  );
};

export default ContestTimer;