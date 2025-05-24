import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { blue, orange } from '@mui/material/colors';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { ContestApi } from 'features/contest/api';
import { Contest, ContestType } from 'features/contest/type';
import { User } from 'features/user/type';
import { UserApi } from 'features/user/api';
import { useDebouncedValue } from 'hooks/useDebouncedValue';

export default function ContestManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [totalElements, setTotalElements] = useState(0);
  const [typeFilter, setTypeFilter] = useState<ContestType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [showTypeDialog, setShowTypeDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [contestAuthors, setContestAuthors] = useState<Record<string, User[]>>(
    {}
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await ContestApi.getAllContests(
          debouncedQuery,
          page,
          rowsPerPage,
          dateRange.start?.toISOString() || '',
          dateRange.end?.toISOString() || '',
          typeFilter === 'ALL' ? '' : typeFilter
        );
        setContests(response.content);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch contests:', error);
        setError('Failed to load contests');
        enqueueSnackbar('Failed to load contests', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [
    page,
    rowsPerPage,
    debouncedQuery,
    typeFilter,
    dateRange,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    const fetchContestAuthors = async () => {
      try {
        // Collect all unique author IDs
        const authorIds = [...new Set(contests.flatMap((c) => c.authors))];
        if (authorIds.length === 0) return;

        // Fetch authors in batch
        const authors = await UserApi.getUsers(authorIds);

        // Group authors by contest
        const authorsByContest: Record<string, User[]> = {};
        contests.forEach((contest) => {
          authorsByContest[contest.id] = authors.filter((author) =>
            contest.authors.includes(author.id)
          );
        });

        setContestAuthors(authorsByContest);
      } catch (error) {
        console.error('Failed to fetch contest authors:', error);
      }
    };

    if (contests.length > 0) {
      fetchContestAuthors();
    }
  }, [contests]);

  const handleUpdateContestType = async (type: ContestType) => {
    if (!selectedContest) return;

    try {
      await ContestApi.updateContest(selectedContest.id, { type });
      enqueueSnackbar('Contest type updated successfully', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      // Refresh contests
      const updatedContests = await ContestApi.getAllContests(
        searchQuery,
        page,
        rowsPerPage,
        dateRange.start?.toISOString() || '',
        dateRange.end?.toISOString() || '',
        typeFilter === 'ALL' ? '' : typeFilter
      );
      setContests(updatedContests.content);
    } catch (error) {
      console.error('Failed to update contest type:', error);
      enqueueSnackbar('Failed to update contest type', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setShowTypeDialog(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleEnabled = async (contest: Contest) => {
    try {
      await ContestApi.updateContest(contest.id, {
        enabled: !contest.enabled,
      });
      enqueueSnackbar('Contest status updated successfully', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      // Refresh contests
      const updatedContests = await ContestApi.getAllContests(
        searchQuery,
        page,
        rowsPerPage,
        dateRange.start?.toISOString() || '',
        dateRange.end?.toISOString() || '',
        typeFilter === 'ALL' ? '' : typeFilter
      );
      setContests(updatedContests.content);
    } catch (error) {
      console.error('Failed to update contest status:', error);
      enqueueSnackbar('Failed to update contest status', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: blue[700] }}>
        Contest Management
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search contests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
        />

        {/* Contest Type Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Contest Type</InputLabel>
          <Select
            value={typeFilter}
            label="Contest Type"
            onChange={(e) =>
              setTypeFilter(e.target.value as ContestType | 'ALL')
            }
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value="SYSTEM">System</MenuItem>
            <MenuItem value="ICPC">ICPC</MenuItem>
            <MenuItem value="GYM">Gym</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
          </Select>
        </FormControl>

        {/* Date Range Pickers */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="From Date"
            value={dateRange.start}
            onChange={(date) =>
              setDateRange((prev) => ({ ...prev, start: date }))
            }
          />
          <DateTimePicker
            label="To Date"
            value={dateRange.end}
            onChange={(date) =>
              setDateRange((prev) => ({ ...prev, end: date }))
            }
          />
        </LocalizationProvider>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: blue[50] }}>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contests.map((contest) => (
                <TableRow
                  key={contest.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>{contest.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={contest.type}
                      size="small"
                      sx={{
                        backgroundColor:
                          contest.type === 'SYSTEM'
                            ? orange[500]
                            : contest.type === 'ICPC'
                              ? blue[500]
                              : 'default',
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {contestAuthors[contest.id]?.map((author) => (
                        <Chip
                          key={author.id}
                          label={author.username}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {format(contest.startTime, 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {format(contest.endTime, 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={contest.enabled ? 'Enabled' : 'Disabled'}
                      size="small"
                      color={contest.enabled ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
                        setSelectedContest(contest);
                        setActionMenuAnchor(e.currentTarget);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setShowTypeDialog(true);
            setActionMenuAnchor(null);
          }}
        >
          Change Type
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedContest) {
              handleToggleEnabled(selectedContest);
            }
            setActionMenuAnchor(null);
          }}
        >
          {selectedContest?.enabled ? 'Disable' : 'Enable'} Contest
        </MenuItem>
      </Menu>

      {/* Change Type Dialog */}
      <Dialog open={showTypeDialog} onClose={() => setShowTypeDialog(false)}>
        <DialogTitle>Change Contest Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Contest Type</InputLabel>
            <Select
              value={selectedContest?.type || ''}
              label="Contest Type"
              onChange={(e) =>
                handleUpdateContestType(e.target.value as ContestType)
              }
            >
              {Object.values(ContestType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTypeDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              handleUpdateContestType(selectedContest?.type as ContestType)
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
