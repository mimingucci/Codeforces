import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper,
  Chip,
  Stack,
  Button,
  Divider 
} from '@mui/material';
import {
  Person as PersonIcon,
  Star as StarIcon,
  Tag as TagIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import "@vaadin/split-layout";
import Landing from "../CodeEditor/Components/Landing";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import ProblemNavbar from "./ProblemNavbar";
import { useParams } from "react-router-dom";

// Custom TabPanel component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

const Problem = () => {
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const rs = await ProblemApi.getProblem(id);
      if (rs?.data?.code === "200") {
        setProblem(rs?.data?.data);
      } else {
        setProblem(null);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <vaadin-split-layout orientation="vertical">
      {problem ? (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Problem Statement Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {problem.title}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                time limit per test: {problem.timeLimit / 1000} seconds
              </Typography>
              <Typography variant="body1">
                memory limit per test: {problem.memoryLimit / 1000000} megabytes
              </Typography>
              <Typography variant="body1">input: standard input</Typography>
              <Typography variant="body1">output: standard output</Typography>
            </Box>
            <div
              dangerouslySetInnerHTML={{ __html: problem?.statement }}
              style={{ textAlign: 'left' }}
            />
          </Box>

          {/* Problem Info Tabs */}
          <Paper sx={{ width: 300, height: 'fit-content' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<DescriptionIcon />} label="Info" />
              <Tab icon={<TagIcon />} label="Tags" />
              <Tab icon={<BarChartIcon />} label="Stats" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon />
                  <Typography>Author: {problem?.author?.username}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <StarIcon />
                  <Typography>Rating: {problem?.rating}</Typography>
                </Box>
                <Divider />
              </Stack>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {problem?.tags?.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small"
                    clickable
                  />
                ))}
              </Stack>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Stack spacing={2}>
                <Typography>
                  Total Submissions: {problem?.submissions}
                </Typography>
                {problem?.solution && (
                  <Button 
                    variant="contained" 
                    fullWidth
                    href={`/solution/${problem.id}`}
                  >
                    View Solution
                  </Button>
                )}
              </Stack>
            </TabPanel>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">
            Cannot fetch problem statements
          </Typography>
        </Box>
      )}

      <div>
        <Landing
          sampleinput={'1 2 3'}
          sampleoutput={'2'}
          problem={problem?.id}
        />
      </div>
    </vaadin-split-layout>
  );
};

export default Problem;
