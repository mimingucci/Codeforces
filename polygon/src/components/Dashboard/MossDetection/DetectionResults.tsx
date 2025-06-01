import React, { useState, useEffect } from 'react';
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
  Chip,
  Link,
  Stack,
  LinearProgress
} from '@mui/material';
import { Refresh, OpenInNew, CheckCircle, Error, Schedule } from '@mui/icons-material';
import { mossApi, MossDetectionResponse } from 'services/api/mossApi';

interface DetectionResultsProps {
  contestId?: number | null;
}

const PROGRAMMING_LANGUAGES = [
  { value: 'C', label: 'C' },
  { value: 'CPP', label: 'C++' },
  { value: 'JAVA', label: 'Java' },
  { value: 'PY3', label: 'Python 3' },
  { value: 'JS', label: 'JavaScript' },
  { value: 'PHP', label: 'PHP' },
  { value: 'GO', label: 'Go' }
];

export default function DetectionResults({ contestId: propContestId }: DetectionResultsProps) {
  const [contestId, setContestId] = useState<string>(propContestId?.toString() || '');
  const [language, setLanguage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MossDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (propContestId) {
      setContestId(propContestId.toString());
    }
  }, [propContestId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && result && result.status === 'PROCESSING') {
      interval = setInterval(() => {
        handleFetch();
      }, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, result, contestId, language]);

  const handleFetch = async () => {
    if (!contestId || !language) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await mossApi.getDetection(parseInt(contestId), language);
      
      if (response) {
        setResult(response);
        
        // Stop auto-refresh if completed or failed
        if (response.status !== 'PROCESSING') {
          setAutoRefresh(false);
        }
      } else {
        setError('Failed to fetch detection result');
        setAutoRefresh(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Detection not found');
      setAutoRefresh(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'FAILED':
        return <Error sx={{ color: 'error.main' }} />;
      case 'PROCESSING':
        return <Schedule sx={{ color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'PROCESSING':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          View Detection Results
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Contest ID"
              type="number"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
              required
              sx={{ flex: 1 }}
              disabled={loading}
            />

            <TextField
              label="Programming Language"
              select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              sx={{ flex: 1 }}
              disabled={loading}
            >
              {PROGRAMMING_LANGUAGES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={handleFetch}
              disabled={loading || !contestId || !language}
              startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Loading...' : 'Fetch'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {result && (
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">
                    Detection Results
                  </Typography>
                  <Chip
                    icon={getStatusIcon(result.status)}
                    label={result.status}
                    color={getStatusColor(result.status)}
                    variant="outlined"
                  />
                </Box>

                {result.status === 'PROCESSING' && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                      Detection is in progress... Auto-refreshing every 5 seconds
                    </Typography>
                  </Box>
                )}

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Detection ID: {result.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contest ID: {result.contestId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Language: {result.language}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detection Time: {new Date(result.detectionTime).toLocaleString()}
                    </Typography>
                  </Box>

                  {result.message && (
                    <Alert severity={result.status === 'FAILED' ? 'error' : 'info'}>
                      {result.message}
                    </Alert>
                  )}

                  {result.resultUrl && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        MOSS Report:
                      </Typography>
                      <Link
                        href={result.resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        View MOSS Report
                        <OpenInNew fontSize="small" />
                      </Link>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
