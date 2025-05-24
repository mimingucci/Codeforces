import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Box,
  Link,
} from '@mui/material';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from 'date-fns';
import ContestApi from '../../getApi/ContestApi';
import HandleCookies from '../../utils/HandleCookies';
import Loading from '../shared/Loading';
import RegisterModal from './RegisterModal';
import CancelRegistrationModal from './CancelRegistrationModal';
import { formatContestDurationHours } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const UpcomingContests = ({ contestType }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleRegisterClick = (contest) => {
    const token = HandleCookies.getCookie('token');
    if (!token) {
      showErrorToast('Please login to register for contests');
      return;
    }
    setSelectedContest(contest);
    setRegisterModalOpen(true);
  };

  const handleRegisterConfirm = async ({ contestId, isRated }) => {
    try {
      const res = await ContestApi.registerContest({ contestId, accessToken: HandleCookies.getCookie('token'), isRated });
      if (res?.data?.code === "200") {
        setContests(prev => prev.map(contest => 
          contest.id === contestId 
            ? { ...contest, registered: true, isRated }
            : contest
        ));
      }  
      showSuccessToast('Successfully registered for contest!');
    } catch (error) {
      showErrorToast('Failed to register for contest');
    }
  };

  const handleCancelClick = (contest) => {
    const token = HandleCookies.getCookie('token');
    if (!token) {
      showErrorToast('Please login to manage registrations');
      return;
    }
    setSelectedContest(contest);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (contestId) => {
    try {
      const res = await ContestApi.cancelRegistration({ contestId, accessToken: HandleCookies.getCookie('token') });
      if (res?.data?.code === "200") {
        setContests(prev => prev.map(contest => 
          contest.id === contestId 
            ? { ...contest, registered: false }
            : contest
        ));
        showSuccessToast('Registration cancelled successfully');
      } else {
        showErrorToast('Failed to cancel registration');
      } 
    } catch (error) {
      showErrorToast('Failed to cancel registration');
    }
  };

  const isContestStaff = (contest) => {
    const userId = HandleCookies.getCookie('id');
    if (!userId) return false;
    
    return [
      ...(contest.authors || []),
      ...(contest.coordinators || []),
      ...(contest.testers || [])
    ].includes(userId);
  };

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      try {
        const response = await ContestApi.getUpcomingContests({ type: contestType?.toUpperCase(), days: 7 });
        
        const contestsData = response.data?.data || [];
        const token = HandleCookies.getCookie('token');

        if (token) {
          // Check registration status for each contest
          const contestsWithRegistration = await Promise.all(
            contestsData.map(async (contest) => {
              try {
                const regResponse = await ContestApi.getUserRegistration({
                  contestId: contest.id,
                  accessToken: token
                });
                
                if (regResponse?.data?.code === "200" && regResponse?.data?.data) {
                  return {
                    ...contest,
                    registered: true,
                    isRated: regResponse.data.data?.rated
                  };
                }
                return contest;
              } catch (error) {
                // If registration not found, contest is not registered
                return contest;
              }
            })
          );
          setContests(contestsWithRegistration);
        } else {
          setContests(contestsData);
        }
      } catch (error) {
        showErrorToast('Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingContests();
  }, [contestType]);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-center",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Grid container spacing={3}>
      {contests.map(contest => (
        <Grid item xs={12} md={6} key={contest.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              <Link
                  component="button"
                  variant="h6"
                  onClick={() => navigate(`/contest/${contest.id}`)}
                  sx={{
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {contest.name}
                </Link>
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
                {isContestStaff(contest) ? (
                  <Button 
                    variant="outlined"
                    disabled
                    fullWidth
                    sx={{ color: 'text.secondary' }}
                  >
                    Contest Staff
                  </Button>
                ) : (
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
                )}
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