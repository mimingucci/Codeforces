import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Typography,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';

import { useParams } from 'react-router-dom';
import ContestTimer from './ContestTimer';
import ContestProblems from './ContestProblems';
import ContestApi from '../../getApi/ContestApi';
import ProblemApi from '../../getApi/ProblemApi';
import ContestLeaderboard from './ContestLeaderboard';

const ContestDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await ContestApi.getContestById(id);
        setContest(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contest details:', error);
        setLoading(false);
      }
    }

    fetchContestDetails();

    if (shouldRefresh) {
      const fetchProblems = async () => {
        try {
          const response = await ProblemApi.getProblemsByContestId(id);
          setProblems(response.data.data);
        } catch (error) {
          console.error('Failed to fetch problems:', error);
        }
      }
      fetchProblems(); 
      setShouldRefresh(false);
    }
  }, [id, shouldRefresh]);

  const handleContestStart = () => {
    setShouldRefresh(true);
  };

  const handleTabChange = (event, newValue) => {
    const tabs = ['problems', 'leaderboard'];
    setActiveTab(newValue);
  };

  const isContestStarted = () => {
    if (!contest?.startTime) return false;
    return new Date(contest.startTime) <= new Date();
  };

  const renderContestContent = () => {
    if (!isContestStarted()) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2
          }}
        >
          <AccessTime sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h5" color="primary">
            Contest hasn't started yet
          </Typography>
          <ContestTimer 
            startTime={contest?.startTime}
            endTime={contest?.endTime}
            name={contest?.name}
          />
        </Box>
      );
    }

    return (
      <>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Problems" />
          <Tab label="Leaderboard" />
        </Tabs>
        {activeTab === 0 && <ContestProblems problems={problems} />}
        {activeTab === 1 && <ContestLeaderboard contest={contest} />}
      </>
    );
  };    

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1100,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5">{contest?.name}</Typography>
              <Chip 
                label={contest?.type} 
                color="primary" 
                size="small" 
              />
              <Box sx={{ ml: 'auto' }}>
                <ContestTimer 
                  startTime={contest?.startTime}
                  endTime={contest?.endTime}
                  name={contest?.name}
                  onContestStart={handleContestStart}
                />
              </Box>
            </Box>
            {isContestStarted() && renderContestContent()}
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {!isContestStarted() && renderContestContent()}
      </Container>
    </>
  );
};

export default ContestDetail;