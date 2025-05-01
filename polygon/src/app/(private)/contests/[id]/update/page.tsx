'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ... Keep the same interfaces and mock users from create page ...
interface StaffMember {
  id: string;
  username: string;
  role: 'AUTHOR' | 'TESTER' | 'COORDINATOR';
}

interface User {
  id: string;
  username: string;
  email: string;
  rating: number;
}

// Add this after your StaffMember interface
const mockUsers: User[] = [
  { id: '1', username: 'tourist', email: 'tourist@example.com', rating: 3000 },
  { id: '2', username: 'Petr', email: 'petr@example.com', rating: 2800 },
  { id: '3', username: 'scott_wu', email: 'scott@example.com', rating: 2700 },
  {
    id: '4',
    username: 'ecnerwala',
    email: 'ecnerwala@example.com',
    rating: 2900,
  },
  { id: '5', username: 'Benq', email: 'benq@example.com', rating: 2850 },
  { id: '6', username: 'Um_nik', email: 'umnik@example.com', rating: 2750 },
];

// Mock current user
const currentUser: User = {
  id: '7',
  username: 'Jiangly',
  email: 'jiangly@example.com',
  rating: 3200,
};

// Mock API call to fetch contest data
const fetchContestData = async (id: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock contest data
  const mockContest = {
    id,
    name: 'Educational Codeforces Round 100',
    startTime: new Date('2025-06-01T14:00:00Z'),
    endTime: new Date('2025-06-01T16:00:00Z'),
    isEnabled: true,
    staff: [
      { ...currentUser, role: 'AUTHOR' },
      { ...mockUsers[0], role: 'COORDINATOR' },
      { ...mockUsers[1], role: 'TESTER' },
      { ...mockUsers[2], role: 'TESTER' },
    ] as StaffMember[],
  };

  // Simulate API error for specific ID
  if (id === '404') {
    throw new Error('Contest not found');
  }

  return mockContest;
};

export default function UpdateContest() {
  const params = useParams();
  const contestId = params.id as string;

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    const loadContestData = async () => {
      try {
        const data = await fetchContestData(contestId);
        setName(data.name);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setIsEnabled(data.isEnabled);
        setStaff(data.staff);
      } catch (err) {
        setError('Failed to load contest data');
      } finally {
        setLoading(false);
      }
    };

    loadContestData();
  }, [contestId]);

  // Mock API call to update contest
  const updateContest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate API error for specific condition
    if (name.length < 3) {
      throw new Error('Contest name must be at least 3 characters');
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');

    try {
      await updateContest();
      // You might want to show success message or redirect
    } catch (err: unknown) {
      setError('Failed to update contest');
    } finally {
      setSaveLoading(false);
    }
  };

  // Keep the same handler functions from create page
  const handleAddStaffMember =
    (role: StaffMember['role']) => (event: any, value: any) => {
      if (value) {
        setStaff([...staff, { ...value, role }]);
        // Reset filtered users after selection
        handleSearch(searchQuery);
      }
    };

  const handleRemoveStaffMember = (memberId: string) => {
    // Prevent removing current user as author
    if (
      memberId === currentUser.id &&
      staff.find((m) => m.id === memberId)?.role === 'AUTHOR'
    ) {
      return;
    }
    setStaff(staff.filter((member) => !(member.id === memberId)));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) &&
        // Allow adding same user in different roles
        user.id !== currentUser.id // Don't show current user in search
    );
    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Contest
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Contest Name"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DateTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                    sx={{ flex: 1 }}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                    sx={{ flex: 1 }}
                  />
                </Stack>
              </LocalizationProvider>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Contest Staff
                </Typography>

                <Stack spacing={3}>
                  {['AUTHOR', 'COORDINATOR', 'TESTER'].map((role) => (
                    <Box key={role}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {role}s
                      </Typography>

                      <Stack spacing={2}>
                        <Autocomplete
                          options={filteredUsers}
                          getOptionLabel={(option) =>
                            `${option.username} (${option.rating})`
                          }
                          onChange={handleAddStaffMember(
                            role as StaffMember['role']
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Typography>{option.username}</Typography>
                                <Chip
                                  label={option.rating}
                                  size="small"
                                  color={
                                    option.rating >= 2800
                                      ? 'error'
                                      : option.rating >= 2400
                                        ? 'warning'
                                        : 'default'
                                  }
                                />
                              </Stack>
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`Add ${role.toLowerCase()}`}
                              onChange={(e) => handleSearch(e.target.value)}
                              size="small"
                            />
                          )}
                          filterOptions={(x) => x}
                          noOptionsText="No users found"
                        />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {staff
                            .filter((member) => member.role === role)
                            .map((member) => (
                              <Chip
                                key={`${member.id}-${member.role}`}
                                label={`${member.username} (${mockUsers.find((u) => u.id === member.id)?.rating || currentUser.rating})`}
                                onDelete={
                                  member.id === currentUser.id
                                    ? undefined
                                    : () => handleRemoveStaffMember(member.id)
                                }
                                color={
                                  member.id === currentUser.id
                                    ? 'primary'
                                    : 'default'
                                }
                              />
                            ))}
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                  />
                }
                label="Enable Contest"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saveLoading}
                sx={{ mt: 2 }}
              >
                {saveLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Update Contest'
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
