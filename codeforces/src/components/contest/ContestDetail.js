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
import ContestApi from '../../getApi/ContestApi';
import ProblemApi from '../../getApi/ProblemApi';
import ContestLeaderboard from './ContestLeaderboard';

const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchContestDetails = async () => {
      try {
        console.log(id);
        const response = await ContestApi.getContestById(id);
        setContest(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contest details:', error);
        setLoading(false);
      }
    }

    const fetchProblems = async () => {
      try {
        const response = await ProblemApi.getProblemsByContestId(id);
        setProblems(response.data.data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    }
    fetchContestDetails();
    fetchProblems();  
  }, [id]);

  const handleTabChange = (event, newValue) => {
    const tabs = ['problems', 'leaderboard'];
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
                  name={contest?.name}
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
        {activeTab === 0 && <ContestProblems problems={problems} />}
        {activeTab === 1 && <ContestLeaderboard contest={contest} />}
      </Container>
    </>
  );
};

export default ContestDetail;