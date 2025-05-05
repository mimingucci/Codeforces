'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Contest } from 'features/contest/type';
import { ContestApi } from 'features/contest/api';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';
import {
  formatContestDate,
  formatContestDuration,
  isContestPast,
} from 'utils/date';

export default function Contests() {
  const [activeTab, setActiveTab] = useState(0);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contestToDelete, setContestToDelete] = useState<Contest | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleDeleteClick = (contest: Contest) => {
    setContestToDelete(contest);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contestToDelete) return;

    try {
      await ContestApi.deleteContest(contestToDelete.id);
      enqueueSnackbar('Contest deleted successfully', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      fetchContests(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete contest:', error);
      enqueueSnackbar('Failed to delete contest', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setDeleteDialogOpen(false);
      setContestToDelete(null);
    }
  };

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await ContestApi.getContests();
      setContests(data);
      console.log('Fetched contests:', data);
    } catch (err) {
      console.error('Failed to fetch contests:', err);
      setError('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const getUserRole = (contest: Contest, userId: string): string => {
    if (contest.authors.includes(userId)) {
      return 'AUTHOR';
    }
    if (contest.coordinators.includes(userId)) {
      return 'COORDINATOR';
    }
    if (contest.testers.includes(userId)) {
      return 'TESTER';
    }
    return 'NONE';
  };

  const developingContests = contests.filter(
    (contest) => !isContestPast(contest.endTime)
  );

  const pastContests = contests.filter((contest) =>
    isContestPast(contest.endTime)
  );

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'AUTHOR':
        return 'primary';
      case 'TESTER':
        return 'secondary';
      case 'COORDINATOR':
        return 'success';
      default:
        return 'default';
    }
  };

  const getContestStatus = (
    startTime: string,
    endTime: string
  ): {
    label: 'DEVELOPMENT' | 'RUNNING' | 'RELEASED';
    color: 'warning' | 'info' | 'success';
  } => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return { label: 'DEVELOPMENT', color: 'warning' };
    } else if (now >= start && now <= end) {
      return { label: 'RUNNING', color: 'info' };
    } else {
      return { label: 'RELEASED', color: 'success' };
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Contests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/contests/create"
        >
          Create Contest
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Developing Contests (${developingContests.length})`} />
          <Tab label={`Past Contests (${pastContests.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {developingContests.map((contest) => (
                    <TableRow key={contest.id} hover>
                      <TableCell>{contest.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={getUserRole(contest, userId as string)}
                          color={getRoleColor(
                            getUserRole(contest, userId as string)
                          )}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            getContestStatus(contest.startTime, contest.endTime)
                              .label
                          }
                          color={
                            getContestStatus(contest.startTime, contest.endTime)
                              .color
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            href={`/contests/${contest.id}`}
                          >
                            Manage
                          </Button>
                          {session?.user?.id === contest.createdBy &&
                            getContestStatus(contest.startTime, contest.endTime)
                              .label === 'DEVELOPMENT' && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteClick(contest)}
                              >
                                Delete
                              </Button>
                            )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastContests.map((contest) => (
                    <TableRow key={contest.id} hover>
                      <TableCell>{contest.name}</TableCell>
                      <TableCell>
                        {formatContestDate(contest.startTime)}
                      </TableCell>
                      <TableCell>
                        {formatContestDuration(
                          contest.startTime,
                          contest.endTime
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          href={`/contests/${contest.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {((activeTab === 0 && developingContests.length === 0) ||
            (activeTab === 1 && pastContests.length === 0)) && (
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ py: 3 }}
            >
              No contests found
            </Typography>
          )}
        </Box>
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Contest?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete contest "{contestToDelete?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
