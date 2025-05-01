'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ContestData {
  id: string;
  name: string;
  role: 'AUTHOR' | 'TESTER' | 'COORDINATOR';
  status: 'DEVELOPMENT' | 'RELEASED';
  startTime?: string;
  duration?: string;
}

export default function Contests() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'AUTHOR':
        return 'primary';
      case 'TESTER':
        return 'secondary';
      case 'COORDINATOR':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Contests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          href="/contests/create"
        >
          Create Contest
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Developing Contests" />
          <Tab label="Past Contests" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Add your developing contests data mapping here */}
                  <TableRow hover>
                    <TableCell>Example Contest</TableCell>
                    <TableCell>
                      <Chip label="AUTHOR" color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label="DEVELOPMENT" color="warning" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        href="/contests/1"
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Add your past contests data mapping here */}
                  <TableRow hover>
                    <TableCell>Example Past Contest</TableCell>
                    <TableCell>2024-05-01 14:00</TableCell>
                    <TableCell>02:00:00</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        href="/contests/1"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
