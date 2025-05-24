import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { format } from 'date-fns';
import ContestApi from '../../getApi/ContestApi';
import { calculateDuration, getRelativeTime } from '../../utils/dateUtils';

const RunningContests = ({ contestType }) => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchRunningContests = async () => {
      try {
        const response = await ContestApi.getRunningContests({ type: contestType?.toUpperCase() });
        setContests(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch running contests:', error);
      }
    };

    fetchRunningContests();
    // Refresh every minute to update remaining time
    const interval = setInterval(fetchRunningContests, 60000);
    return () => clearInterval(interval);
  }, [contestType]);

  if (contests.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No contests are currently running
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Time Left</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest) => (
              <TableRow 
                key={contest.id}
                sx={{ 
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                <TableCell>
                  <Box>
                    <Link 
                      href={`/contest/${contest.id}`}
                      color="primary"
                      sx={{ fontWeight: 'bold', display: 'block' }}
                    >
                      {contest.name}
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      Started {getRelativeTime(contest.startTime)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={contest.type} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography color="error.main" fontWeight="medium">
                    {getRelativeTime(contest.endTime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/contest/${contest.id}`}
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Enter
                  </Link>
                  <Link 
                    href={`/contest/${contest.id}?tab=standing`}
                    color="secondary"
                  >
                    Standings
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RunningContests;