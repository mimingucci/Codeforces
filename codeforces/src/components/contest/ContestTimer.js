import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { differenceInSeconds } from 'date-fns';
import ContestAlert from '../common/ContestAlert';

const ContestTimer = ({ startTime, endTime, name = '' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const previousStatus = useRef(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      const previousStatusValue = previousStatus.current;

      if (now < start) {
        setStatus('Before');
        const diff = differenceInSeconds(start, now);
        setTimeLeft(formatTime(diff));
      } else if (now > end) {
        setStatus('Finished');
        setTimeLeft('00:00:00');
        // Show alert only when status changes from Running to Finished
        if (previousStatusValue === 'Running') {
          setAlertOpen(true);
        }
      } else {
        setStatus('Running');
        const diff = differenceInSeconds(end, now);
        setTimeLeft(formatTime(diff));
      }

      previousStatus.current = status;
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, status]);

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
    <>
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
      <ContestAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Contest Ended"
        message={`The contest "${name}" has ended. You can now view the final standings.`}
        severity="info"
        actionText="Close"
      />
    </>
  );
};

export default ContestTimer;