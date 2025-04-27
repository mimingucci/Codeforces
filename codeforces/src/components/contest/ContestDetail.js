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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContestTimer from './ContestTimer';
import ContestProblems from './ContestProblems';
// import ContestLeaderboard from './ContestLeaderboard';
import { mockContestDetail } from '../../data/mockContests';

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContest(mockContestDetail);
      setLoading(false);
    }, 1000);
  }, [contestId]);

  const handleTabChange = (event, newValue) => {
    const tabs = ['problems', 'leaderboard'];
    navigate(`/contest/${contestId}/${tabs[newValue]}`);
    setActiveTab(newValue);
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
                />
              </Box>
            </Box>

            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
            >
              <Tab label="Problems" />
              <Tab label="Leaderboard" />
            </Tabs>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {activeTab === 0 && <ContestProblems contest={contest} />}
        {/* {activeTab === 1 && <ContestLeaderboard contest={contest} />} */}
      </Container>
    </>
  );
};

export default ContestDetail;