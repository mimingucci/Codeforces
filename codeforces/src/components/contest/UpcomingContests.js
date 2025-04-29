import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import ContestApi from '../../getApi/ContestApi';
import HandleCookies from '../../utils/HandleCookies';
import Loading from '../shared/Loading';
import RegisterModal from './RegisterModal';
import CancelRegistrationModal from './CancelRegistrationModal';
import { formatContestDurationHours } from '../../utils/dateUtils';

const UpcomingContests = ({ contestType }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleRegisterClick = (contest) => {
    const token = HandleCookies.getCookie('token');
    if (!token) {
    //   toast.error('Please login to register for contests');
      return;
    }
    setSelectedContest(contest);
    setRegisterModalOpen(true);
  };

  const handleRegisterConfirm = async ({ contestId, isRated }) => {
    try {
      // Simulate API call
      setContests(prev => prev.map(contest => 
        contest.id === contestId 
          ? { ...contest, registered: true, isRated }
          : contest
      ));
    //   toast.success('Successfully registered for contest!');
    } catch (error) {
    //   toast.error('Failed to register for contest');
    }
  };

  const handleCancelClick = (contest) => {
    const token = HandleCookies.getCookie('token');
    if (!token) {
      // toast.error('Please login to manage registrations');
      return;
    }
    setSelectedContest(contest);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (contestId) => {
    try {
      // Simulate API call
      setContests(prev => prev.map(contest => 
        contest.id === contestId 
          ? { ...contest, registered: false, isRated: undefined }
          : contest
      ));
      // toast.success('Registration cancelled successfully');
    } catch (error) {
      // toast.error('Failed to cancel registration');
    }
  };

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      try {
        const response = await ContestApi.getUpcomingContests({ type: contestType?.toUpperCase(), days: 7 });
        setContests(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch upcoming contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingContests();
  }, [contestType]);

  const handleRegister = async (contestId) => {
    const token = HandleCookies.getCookie('token');
    if (!token) {
    //   toast.error('Please login to register for contests');
      return;
    }

    try {
      // Simulate API call
      setContests(prev => prev.map(contest => 
        contest.id === contestId 
          ? { ...contest, registered: true }
          : contest
      ));
    //   toast.success('Successfully registered for contest!');
    } catch (error) {
    //   toast.error('Failed to register for contest');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <Grid container spacing={3}>
      {contests.map(contest => (
        <Grid item xs={12} md={6} key={contest.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {contest.name}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={contest.type.toUpperCase()} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`Starts ${formatDistanceToNow(new Date(contest.startTime))}`}
                  color="secondary"
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {formatContestDurationHours(contest.startTime, contest.endTime)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant={contest?.registered ? "outlined" : "contained"}
                    onClick={() => contest?.registered 
                      ? handleCancelClick(contest)
                      : handleRegisterClick(contest)
                    }
                    fullWidth
                    color={contest?.registered ? "error" : "primary"}
                  >
                    {contest?.registered ? 'Cancel Registration' : 'Register'}
                  </Button>
                </Box>
                {contest?.registered && contest.type === 'SYSTEM' && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                  >
                    Registered as {contest?.isRated ? 'rated' : 'unrated'} participant
                  </Typography>
                )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onConfirm={handleRegisterConfirm}
        contest={selectedContest}
        showRatedOption={selectedContest?.type === 'SYSTEM'}
    />
    <CancelRegistrationModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        contest={selectedContest}
      />
    </>
  );
};

export default UpcomingContests;