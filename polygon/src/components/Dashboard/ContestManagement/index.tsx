import { useState } from 'react';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { blue, orange } from '@mui/material/colors';
import { format } from 'date-fns';

type ContestType = 'SYSTEM' | 'ICPC' | 'GYM' | 'NORMAL';

interface ContestStaff {
  id: number;
  username: string;
  role: 'AUTHOR' | 'COORDINATOR' | 'TESTER';
}

interface Contest {
  id: number;
  name: string;
  type: ContestType;
  staff: ContestStaff[];
  startTime: Date;
  endTime: Date;
  enabled: boolean;
}

// Mock data
const mockContests: Contest[] = [
  {
    id: 1,
    name: 'Educational Codeforces Round 100',
    type: 'NORMAL',
    staff: [
      { id: 1, username: 'tourist', role: 'AUTHOR' },
      { id: 2, username: 'Petr', role: 'COORDINATOR' },
    ],
    startTime: new Date('2025-05-01T14:00:00Z'),
    endTime: new Date('2025-05-01T16:00:00Z'),
    enabled: true,
  },
  // Add more mock contests...
];

export default function ContestManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredContests = mockContests.filter((contest) => {
    const matchesSearch = contest.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || contest.type === typeFilter;
    const matchesDateRange =
      (!dateRange.start || contest.startTime >= dateRange.start) &&
      (!dateRange.end || contest.endTime <= dateRange.end);

    return matchesSearch && matchesType && matchesDateRange;
  });

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
            {filteredContests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contest) => (
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
                      {contest.staff.map((member) => (
                        <Chip
                          key={member.id}
                          label={member.username}
                          size="small"
                          variant="outlined"
                          color={
                            member.role === 'AUTHOR'
                              ? 'primary'
                              : member.role === 'COORDINATOR'
                                ? 'secondary'
                                : 'default'
                          }
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContests.length}
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
            // Handle toggle enabled status
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
              onChange={(e) => {
                // Handle type change
              }}
            >
              <MenuItem value="SYSTEM">System</MenuItem>
              <MenuItem value="ICPC">ICPC</MenuItem>
              <MenuItem value="GYM">Gym</MenuItem>
              <MenuItem value="NORMAL">Normal</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTypeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowTypeDialog(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
