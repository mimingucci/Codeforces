import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { mossApi, MossDetectionResponse } from 'services/api/mossApi';

interface RunDetectionFormProps {
  onDetectionStarted?: (contestId: number) => void;
}

const PROGRAMMING_LANGUAGES = [
  { value: 'C', label: 'C' },
  { value: 'CPP', label: 'C++' },
  { value: 'JAVA', label: 'Java' },
  { value: 'PY3', label: 'Python 3' },
  { value: 'JS', label: 'JavaScript' },
  { value: 'PHP', label: 'PHP' },
  { value: 'GO', label: 'Go' },
];

export default function RunDetectionForm({
  onDetectionStarted,
}: RunDetectionFormProps) {
  const [contestId, setContestId] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MossDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to clear polling
  const clearPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const pollForResult = (contestId: number, language: string) => {
    let elapsed = 0;
    const interval = 20000; // 20 seconds
    const maxTime = 5 * 60 * 1000; // 5 minutes

    pollingRef.current = setInterval(async () => {
      try {
        const detection = await mossApi.getDetection(contestId, language);
        if (detection.status === 'COMPLETED' || detection.status === 'FAILED') {
          setResult(detection);
          clearPolling();
          setLoading(false);
        }
      } catch (err: any) {
        setError('Error fetching detection status');
        clearPolling();
        setLoading(false);
      }
      elapsed += interval;
      if (elapsed >= maxTime) {
        setError('Detection timed out. Please try again later.');
        clearPolling();
        setLoading(false);
      }
    }, interval);

    // Also set a hard timeout to stop polling after 5 minutes
    timeoutRef.current = setTimeout(() => {
      setError('Detection timed out. Please try again later.');
      clearPolling();
      setLoading(false);
    }, maxTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contestId || !language) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await mossApi.runDetection(
        parseInt(contestId),
        language
      );

      if (response) {
        setResult(response);
        onDetectionStarted?.(parseInt(contestId));
        // Start polling for result
        pollForResult(parseInt(contestId), language);
      } else {
        setError('Failed to start detection');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'An error occurred while starting detection'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContestId('');
    setLanguage('');
    setResult(null);
    setError(null);
  };

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => clearPolling();
  }, []);

  return (
    <Card elevation={1}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <PlayArrow sx={{ mr: 1 }} />
          Start New Detection
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Contest ID"
              type="number"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
              required
              fullWidth
              helperText="Enter the ID of the contest to analyze"
              disabled={loading}
            />

            <TextField
              label="Programming Language"
              select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              fullWidth
              helperText="Select the programming language for analysis"
              disabled={loading}
            >
              {PROGRAMMING_LANGUAGES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {result && (
              <Alert severity="success">
                <Typography variant="subtitle2" gutterBottom>
                  Detection Started Successfully!
                </Typography>
                <Typography variant="body2">
                  Detection ID: {result.id}
                  <br />
                  Status: {result.status}
                  <br />
                  {result.message && `Message: ${result.message}`}
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !contestId || !language}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <PlayArrow />
                }
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Starting...' : 'Run Detection'}
              </Button>

              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
