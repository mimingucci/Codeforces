'use client';

import { useState } from 'react';
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
import { ContestApi } from 'features/contest/api';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

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

export default function CreateContest() {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  // Add router and snackbar
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize staff with current user as author
  const [staff, setStaff] = useState<StaffMember[]>([
    { ...currentUser, role: 'AUTHOR' },
  ]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!name || !startTime || !endTime) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    try {
      const contestData = {
        name,
        startTime,
        endTime,
        enabled: isEnabled,
        authors: staff
          .filter((member) => member.role === 'AUTHOR')
          .map((member) => member.id),
        coodinators: staff
          .filter((member) => member.role === 'COORDINATOR')
          .map((member) => member.id),
        testers: staff
          .filter((member) => member.role === 'TESTER')
          .map((member) => member.id),
      };

      const response = await ContestApi.createContest(contestData);

      enqueueSnackbar('Contest created successfully!', {
        variant: 'success',
        autoHideDuration: 3000,
      });

      // Redirect to contest page
      router.push(`/contests/${response.id}`);
    } catch (err: any) {
      console.error('Create contest error:', err);
      setError(err?.message || 'Failed to create contest');
      enqueueSnackbar('Failed to create contest', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add validation feedback
  const isStartTimeValid = startTime && startTime > new Date();
  const isEndTimeValid = endTime && startTime && endTime > startTime;
  const isFormValid =
    name &&
    isStartTimeValid &&
    isEndTimeValid &&
    staff.some((member) => member.role === 'AUTHOR');

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Contest
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
                error={!name}
                helperText={!name ? 'Contest name is required' : ''}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DateTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                    sx={{ flex: 1 }}
                    minDateTime={new Date()}
                    slotProps={{
                      textField: {
                        helperText: !isStartTimeValid
                          ? 'Start time must be in the future'
                          : '',
                      },
                    }}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                    sx={{ flex: 1 }}
                    minDateTime={startTime || new Date()}
                    slotProps={{
                      textField: {
                        helperText: !isEndTimeValid
                          ? 'End time must be after start time'
                          : '',
                      },
                    }}
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
                disabled={loading || !isFormValid}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Contest'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
