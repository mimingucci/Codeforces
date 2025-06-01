import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { History, OpenInNew, CheckCircle, Error, Schedule } from '@mui/icons-material';
import { mossApi, MossDetectionResponse } from 'services/api/mossApi';

interface DetectionHistoryProps {
  contestId?: number | null;
}

export default function DetectionHistory({ contestId: propContestId }: DetectionHistoryProps) {
  const [contestId, setContestId] = useState<string>(propContestId?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<MossDetectionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propContestId) {
      setContestId(propContestId.toString());
      handleFetch(propContestId);
    }
  }, [propContestId]);

  const handleFetch = async (contestIdParam?: number) => {
    const id = contestIdParam || parseInt(contestId);
    
    if (!id) {
      setError('Please enter a contest ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await mossApi.getAllDetections(id);
      
      if (response) {
        setDetections(response);
      } else {
        setError('Failed to fetch detection history');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'FAILED':
        return <Error sx={{ color: 'error.main', fontSize: 16 }} />;
      case 'PROCESSING':
        return <Schedule sx={{ color: 'warning.main', fontSize: 16 }} />;
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
    <Card elevation={1}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <History sx={{ mr: 1 }} />
          Detection History
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Contest ID"
            type="number"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            required
            sx={{ flex: 1 }}
            disabled={loading}
          />

          <Button
            variant="contained"
            onClick={() => handleFetch()}
            disabled={loading || !contestId}
            startIcon={loading ? <CircularProgress size={20} /> : <History />}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Loading...' : 'Load History'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {detections.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Detection Time</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detections.map((detection) => (
                  <TableRow key={detection.id}>
                    <TableCell>{detection.id}</TableCell>
                    <TableCell>
                      <Chip label={detection.language} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(detection.status)}
                        label={detection.status}
                        color={getStatusColor(detection.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(detection.detectionTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {detection.resultUrl ? (
                        <Link
                          href={detection.resultUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          View Report
                          <OpenInNew fontSize="small" />
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {detection.message || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {detections.length === 0 && !loading && !error && contestId && (
          <Alert severity="info">
            No detection history found for contest {contestId}.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
