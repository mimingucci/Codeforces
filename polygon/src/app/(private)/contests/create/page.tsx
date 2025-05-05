'use client';

import { useEffect, useState } from 'react';
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
import { useSession } from 'next-auth/react';
import { ContestCreate, ContestStaffMember } from 'features/contest/type';
import { UserApi } from 'features/user/api';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { User } from 'features/user/type';

export default function CreateContest() {
  const [name, setName] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  // Add debounced search query
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  const { data } = useSession();

  const currentUser = data?.user;
  // Add router and snackbar
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize staff with current user as author
  const [staff, setStaff] = useState<ContestStaffMember[]>([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const response = await UserApi.search(debouncedQuery);
        const filteredResults = response.content.filter(
          (user) => user.id !== currentUser?.id // Don't show current user in results
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Failed to search users:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    searchUsers();
  }, [debouncedQuery, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setStaff([
        {
          ...currentUser,
          role: 'AUTHOR',
        },
      ]);
    }
  }, [currentUser]);

  // Update handleSearch
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddStaffMember =
    (role: ContestStaffMember['role']) => (event: any, value: any) => {
      if (value) {
        setStaff([...staff, { ...value, role }]);
        // Reset filtered users after selection
        handleSearch(searchQuery);
      }
    };

  const handleRemoveStaffMember = (memberId: string) => {
    // Prevent removing current user as author
    if (
      memberId === currentUser?.id &&
      staff.find((m) => m.id === memberId)?.role === 'AUTHOR'
    ) {
      return;
    }
    setStaff(staff.filter((member) => !(member.id === memberId)));
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
      const contestData: ContestCreate = {
        name,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        enabled: isEnabled,
        authors: staff
          .filter((member) => member.role === 'AUTHOR')
          .map((member) => member.id),
        coordinators: staff
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
                error={!name && name !== null}
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
                          options={searchResults}
                          getOptionLabel={(option) => option.username}
                          onChange={handleAddStaffMember(
                            role as ContestStaffMember['role']
                          )}
                          onInputChange={(_, value) => handleSearch(value)}
                          loading={searching}
                          filterOptions={(x) => x} // Use server-side filtering
                          noOptionsText={
                            searchQuery.length < 2
                              ? 'Type to search users'
                              : searching
                                ? 'Searching...'
                                : 'No users found'
                          }
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
                              size="small"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {searching && (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {staff
                            .filter((member) => member.role === role)
                            .map((member) => (
                              <Chip
                                key={`${member.id}-${member.role}`}
                                label={`${member.username}`}
                                onDelete={
                                  member.id === currentUser?.id
                                    ? undefined
                                    : () => handleRemoveStaffMember(member.id)
                                }
                                color={
                                  member.id === currentUser?.id
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
