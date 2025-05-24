'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { useSession } from 'next-auth/react';
import { Contest, ContestStaffMember } from 'features/contest/type';
import { UserApi } from 'features/user/api';
import { ContestApi } from 'features/contest/api';
import { User } from 'features/user/type';
import { useDebouncedValue } from 'hooks/useDebouncedValue';

export default function UpdateContest() {
  const params = useParams();
  const router = useRouter();

  const contestId = params.id as string;
  const { data: session } = useSession();

  const [contest, setContest] = useState<Contest | null>(null);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState<ContestStaffMember[]>([]);

  // Add state for user search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const [searching, setSearching] = useState(false);
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    const loadContestData = async () => {
      try {
        setLoading(true);
        const data = await ContestApi.getContest(contestId);

        // Check if user has permission to edit
        if (session?.user?.id !== data.createdBy) {
          router.push(`/contests/${contestId}`);
          return;
        }

        setContest(data);
        setName(data.name);
        setStartTime(new Date(data.startTime));
        setEndTime(new Date(data.endTime));
        setIsEnabled(data.enabled);

        // Collect all unique staff IDs
        const allStaffIds = [
          ...(data.authors || []),
          ...(data.coordinators || []),
          ...(data.testers || []),
        ];

        // Skip if no staff members
        if (allStaffIds.length === 0) {
          setStaff([]);
          return;
        }

        // Fetch all users in one batch request
        const users = await UserApi.getUsers([...new Set(allStaffIds)]);

        // Map users to their roles
        const staffMembers: ContestStaffMember[] = [
          ...(data.authors
            ?.map((id) => {
              const user = users.find((u) => u.id === id);
              return user ? { ...user, role: 'AUTHOR' as const } : null;
            })
            .filter(Boolean) || []),
          ...(data.coordinators
            ?.map((id) => {
              const user = users.find((u) => u.id === id);
              return user ? { ...user, role: 'COORDINATOR' as const } : null;
            })
            .filter(Boolean) || []),
          ...(data.testers
            ?.map((id) => {
              const user = users.find((u) => u.id === id);
              return user ? { ...user, role: 'TESTER' as const } : null;
            })
            .filter(Boolean) || []),
        ];

        setStaff(staffMembers);
      } catch (err) {
        console.error('Failed to load contest:', err);
        setError('Failed to load contest data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      loadContestData();
    }
  }, [contestId, session, router]);

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
          (user) => user.id !== session?.user?.id
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
  }, [debouncedQuery, session?.user?.id]);

  // Update handleSearch to just set query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');

    try {
      if (!startTime || !endTime) {
        throw new Error('Please set both start and end time');
      }

      await ContestApi.updateContest(contestId, {
        name,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        enabled: isEnabled,
        authors: staff.filter((s) => s.role === 'AUTHOR').map((s) => s.id),
        coordinators: staff
          .filter((s) => s.role === 'COORDINATOR')
          .map((s) => s.id),
        testers: staff.filter((s) => s.role === 'TESTER').map((s) => s.id),
      });

      router.push(`/contests/${contestId}`);
    } catch (err: any) {
      console.error('Failed to update contest:', err);
      setError(err.message || 'Failed to update contest');
    } finally {
      setSaveLoading(false);
    }
  };

  // Update staff handling
  const handleAddStaffMember =
    (role: ContestStaffMember['role']) => (event: any, value: User | null) => {
      if (value) {
        const newMember = { ...value, role };
        setStaff((prev) => [...prev, newMember]);
      }
    };

  const handleRemoveStaffMember = (memberId: string) => {
    setStaff((prev) => prev.filter((member) => member.id !== memberId));
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
                          options={searchResults}
                          getOptionLabel={(option) =>
                            `${option.username} (${option.rating})`
                          }
                          onChange={handleAddStaffMember(
                            role as ContestStaffMember['role']
                          )}
                          onInputChange={(_, value) => handleSearch(value)}
                          loading={searching}
                          filterOptions={(x) => x}
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
                                  member.id === session?.user?.id
                                    ? undefined
                                    : () => handleRemoveStaffMember(member.id)
                                }
                                color={
                                  member.id === session?.user?.id
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
