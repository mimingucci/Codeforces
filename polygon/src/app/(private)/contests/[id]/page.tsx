'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Skeleton,
  Fade,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  CircleOutlined as ProblemIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ContestApi } from 'features/contest/api';

interface Problem {
  id: string;
  name: string;
  status: 'ready' | 'testing' | 'draft';
}

interface ContestStaff {
  id: string;
  username: string;
  role: 'AUTHOR' | 'COORDINATOR' | 'TESTER';
  rating: number;
}

interface ContestDetails {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  problems: Problem[];
  staff: ContestStaff[];
}

// Mock API call
const fetchContestDetails = async (id: string): Promise<ContestDetails> => {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

  return {
    id,
    name: 'Educational Codeforces Round 100',
    startTime: new Date('2025-06-01T14:00:00Z'),
    endTime: new Date('2025-06-01T16:00:00Z'),
    problems: [
      { id: 'A', name: 'Binary Search', status: 'ready' },
      { id: 'B', name: 'Dynamic Programming', status: 'testing' },
      { id: 'C', name: 'Graph Theory', status: 'draft' },
      { id: 'D', name: 'Data Structures', status: 'ready' },
      { id: 'E', name: 'String Algorithms', status: 'testing' },
    ],
    staff: [
      { id: '1', username: 'Jiangly', role: 'AUTHOR', rating: 3200 },
      { id: '2', username: 'tourist', role: 'COORDINATOR', rating: 3800 },
      { id: '3', username: 'Petr', role: 'TESTER', rating: 3000 },
      { id: '4', username: 'ecnerwala', role: 'TESTER', rating: 2900 },
    ],
  };
};

const getProblemStatusColor = (status: Problem['status']) => {
  switch (status) {
    case 'ready':
      return 'success';
    case 'testing':
      return 'warning';
    case 'draft':
      return 'error';
  }
};

const getRatingColor = (rating: number): string => {
  if (rating >= 3000) return '#FF0000';
  if (rating >= 2600) return '#FFA500';
  if (rating >= 2200) return '#FFFF00';
  return '#808080';
};

export default function ContestPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<ContestDetails | null>(null);

  useEffect(() => {
    const loadContest = async () => {
      try {
        const data = await fetchContestDetails(contestId);
        setContest(data);
        const rep = await ContestApi.getContest(contestId);
        console.log(rep);
      } finally {
        setLoading(false);
      }
    };
    loadContest();
  }, [contestId]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} sx={{ mx: 'auto' }}>
        {/* Left side - Problems List */}
        <Grid item xs={12} md={7}>
          <Fade in={!loading} timeout={500}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Problems
              </Typography>
              <List>
                {loading
                  ? [...Array(5)].map((_, index) => (
                      <ListItem key={index} divider={index !== 4}>
                        <ListItemText
                          primary={<Skeleton width="60%" />}
                          secondary={<Skeleton width="30%" />}
                        />
                        <Skeleton width={80} height={32} variant="rounded" />
                      </ListItem>
                    ))
                  : contest?.problems.map((problem, index) => (
                      <ListItem
                        key={problem.id}
                        divider={index !== contest.problems.length - 1}
                        sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <ListItemIcon>
                          <ProblemIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${problem.id}. ${problem.name}`}
                        />
                      </ListItem>
                    ))}
              </List>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3 }}
                fullWidth
              >
                Add New Problem
              </Button>
            </Paper>
          </Fade>
        </Grid>

        {/* Right side - Contest Info */}
        <Grid item xs={12} md={5}>
          <Fade in={!loading} timeout={700}>
            <Stack spacing={3} sx={{ maxWidth: '100%', mx: 'auto' }}>
              <Paper elevation={1} sx={{ p: 3 }}>
                {loading ? (
                  <Stack spacing={2}>
                    <Skeleton height={40} />
                    <Skeleton height={24} />
                    <Skeleton height={24} />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {contest?.name}
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <ScheduleIcon color="action" />
                        <Typography>
                          Start:{' '}
                          {format(contest?.startTime || new Date(), 'PPp')}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <ScheduleIcon color="action" />
                        <Typography>
                          End: {format(contest?.endTime || new Date(), 'PPp')}
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                )}
              </Paper>

              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contest Staff
                </Typography>
                {loading ? (
                  <Stack spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} height={32} />
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {['AUTHOR', 'COORDINATOR', 'TESTER'].map((role) => (
                      <Box key={role}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {role}s
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          {contest?.staff
                            .filter((member) => member.role === role)
                            .map((member) => (
                              <Chip
                                key={member.id}
                                label={member.username}
                                size="small"
                                icon={<PersonIcon />}
                                sx={{
                                  bgcolor: getRatingColor(member.rating),
                                  color: 'white',
                                  '& .MuiChip-icon': {
                                    color: 'white',
                                  },
                                }}
                              />
                            ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
}
