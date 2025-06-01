import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { Security, BugReport } from '@mui/icons-material';
import RunDetectionForm from './RunDetectionForm';
import DetectionResults from './DetectionResults';
import DetectionHistory from './DetectionHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`moss-tabpanel-${index}`}
      aria-labelledby={`moss-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MossDetection() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(
    null
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Security sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            MOSS Plagiarism Detection
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            MOSS (Measure of Software Similarity) is a system for detecting
            software plagiarism. Select a contest and language to run plagiarism
            detection on submissions.
          </Typography>
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="moss detection tabs"
          >
            <Tab
              icon={<BugReport />}
              label="Run Detection"
              id="moss-tab-0"
              aria-controls="moss-tabpanel-0"
            />
            <Tab
              icon={<Security />}
              label="View Results"
              id="moss-tab-1"
              aria-controls="moss-tabpanel-1"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <RunDetectionForm
            onDetectionStarted={(contestId) => {
              setSelectedContestId(contestId);
              setTabValue(1);
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DetectionResults contestId={selectedContestId} />
          <DetectionHistory contestId={selectedContestId} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
