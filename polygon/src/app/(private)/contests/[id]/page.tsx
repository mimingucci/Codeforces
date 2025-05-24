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
import { Contest, ContestStaffMember } from 'features/contest/type';
import { useSession } from 'next-auth/react';
import { Edit as EditIcon } from '@mui/icons-material';

import { ProblemApi } from 'features/problem/api';
import { Problem } from 'features/problem/type';
import { UserApi } from 'features/user/api';

export default function ContestPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<Contest | null>(null);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(true);

  const [staff, setStaff] = useState<ContestStaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);

  const { data: session } = useSession();

  const fetchStaffMembers = async (contest: Contest) => {
    try {
      // Collect all unique staff IDs
      const allStaffIds = [
        ...(contest.authors || []),
        ...(contest.coordinators || []),
        ...(contest.testers || []),
      ];

      // Remove duplicates if any
      const uniqueStaffIds = [...new Set(allStaffIds)];

      if (uniqueStaffIds.length === 0) {
        setStaff([]);
        return;
      }

      // Fetch all users in one request
      const users = await UserApi.getUsers(uniqueStaffIds);

      // Map users to their roles
      const staffMembers: ContestStaffMember[] = [];

      // Add authors
      contest.authors?.forEach((id) => {
        const user = users.find((u) => u.id === id);
        if (user) staffMembers.push({ ...user, role: 'AUTHOR' });
      });

      // Add coordinators
      contest.coordinators?.forEach((id) => {
        const user = users.find((u) => u.id === id);
        if (user) staffMembers.push({ ...user, role: 'COORDINATOR' });
      });

      // Add testers
      contest.testers?.forEach((id) => {
        const user = users.find((u) => u.id === id);
        if (user) staffMembers.push({ ...user, role: 'TESTER' });
      });

      setStaff(staffMembers);
    } catch (error) {
      console.error('Failed to fetch staff members:', error);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setProblemsLoading(true);
        setStaffLoading(true);

        const [contestData, problemsData] = await Promise.all([
          ContestApi.getContest(contestId),
          ProblemApi.getProblems(contestId),
        ]);

        setContest(contestData);
        setProblems(problemsData);

        // Fetch staff members after getting contest data
        await fetchStaffMembers(contestData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
        setProblemsLoading(false);
      }
    };

    loadData();
  }, [contestId]);

  const renderStaffSection = () => (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contest Staff
      </Typography>
      {staffLoading ? (
        <Stack spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height={32} />
          ))}
        </Stack>
      ) : (
        <Stack spacing={2}>
          {(['AUTHOR', 'COORDINATOR', 'TESTER'] as const).map((role) => (
            <Box key={role}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {role}s ({staff.filter((member) => member.role === role).length}
                )
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {staff
                  .filter((member) => member.role === role)
                  .map((member) => (
                    <Chip
                      key={member.id}
                      label={member.username}
                      size="small"
                      icon={<PersonIcon />}
                      sx={{
                        bgcolor: '#808080',
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                      onClick={() =>
                        window.open(`/profile/${member.id}`, '_blank')
                      }
                    />
                  ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4} sx={{ mx: 'auto' }}>
        {/* Left side - Problems List */}
        <Grid item xs={12} md={8.4} sx={{ minWidth: '40%' }}>
          <Fade in={!loading} timeout={500}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Problems
              </Typography>
              <List>
                {problemsLoading ? (
                  [...Array(5)].map((_, index) => (
                    <ListItem key={index} divider={index !== 4}>
                      <ListItemText
                        primary={<Skeleton width="60%" />}
                        secondary={<Skeleton width="30%" />}
                      />
                      <Skeleton width={80} height={32} variant="rounded" />
                    </ListItem>
                  ))
                ) : problems.length > 0 ? (
                  problems.map((problem, index) => (
                    <ListItem
                      key={problem.id}
                      divider={index !== problems.length - 1}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <ListItemIcon>
                        <ProblemIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={problem.title}
                        secondary={
                          <Stack direction="row" spacing={1}>
                            {problem.rating > 0 && (
                              <Chip
                                label={problem.rating}
                                size="small"
                                sx={{
                                  bgcolor: '#808080',
                                  color: 'white',
                                }}
                              />
                            )}
                          </Stack>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/contests/${contestId}/problems/${problem.id}`}
                      >
                        Edit
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No problems added yet
                  </Typography>
                )}
              </List>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href={`/contests/${contestId}/problems/new`}
                sx={{ mt: 3 }}
                fullWidth
              >
                Add New Problem
              </Button>
            </Paper>
          </Fade>
        </Grid>

        {/* Right side - Contest Info */}
        <Grid item xs={12} md={3.6}>
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {contest?.name}
                      </Typography>
                      {session?.user?.id === contest?.createdBy && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          href={`/contests/${contestId}/update`}
                        >
                          Update Contest
                        </Button>
                      )}
                    </Box>
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

              {renderStaffSection()}
            </Stack>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
}
