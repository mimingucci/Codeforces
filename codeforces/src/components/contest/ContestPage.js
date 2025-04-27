import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Typography,
  useTheme
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UpcomingContests from './UpcomingContests';
import PastContests from './PastContests';

const ContestPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [contestType, setContestType] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  // Get contest type from URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setContestType(hash.toLowerCase());
    }
  }, [location]);

  const handleContestTypeChange = (event, newValue) => {
    const types = ['all', 'system', 'icpc/ioi', 'custom'];
    setContestType(types[newValue]);
    navigate(`#${types[newValue]}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Contests</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={['all', 'icpc/ioi', 'custom'].indexOf(contestType)}
          onChange={handleContestTypeChange}
          aria-label="contest types"
        >
          <Tab label="All Contests" />
          <Tab label="System" />
          <Tab label="ICPC/IOI" />
          <Tab label="Custom" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Upcoming Contests</Typography>
        <UpcomingContests contestType={contestType} />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Past Contests</Typography>
        <PastContests contestType={contestType} />
      </Box>
    </Container>
  );
};

export default ContestPage;