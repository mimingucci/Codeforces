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
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { UserApi } from 'features/user/api';
import { User } from 'features/user/type';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { convertUnixFormatToDate } from 'utils/date';

export default function UserManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const { enqueueSnackbar } = useSnackbar();

  // Fetch users with search and pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await UserApi.search(debouncedQuery);
        setUsers(response.content);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load users');
        enqueueSnackbar('Failed to load users', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, debouncedQuery, enqueueSnackbar]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleEnabled = async (user: User) => {
    try {
      // await UserApi.updateUser(user.id, { enabled: !user.enabled });
      enqueueSnackbar('User status updated successfully', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      // Refresh users
      const response = await UserApi.search(debouncedQuery);
      setUsers(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to update user status:', error);
      enqueueSnackbar('Failed to update user status', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 3000) return '#FF0000';
    if (rating >= 2600) return '#FFA500';
    if (rating >= 2200) return '#FFFF00';
    return '#808080';
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: blue[700] }}>
        User Management
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
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
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Contributions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.rating}
                      size="small"
                      sx={{
                        backgroundColor: getRatingColor(user.rating),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.contribute || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? 'Active' : 'Disabled'}
                      size="small"
                      color={user.enabled ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    {convertUnixFormatToDate(
                      user.createdAt
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
                        setSelectedUser(user);
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
            if (selectedUser) {
              handleToggleEnabled(selectedUser);
            }
            setActionMenuAnchor(null);
          }}
        >
          {selectedUser?.enabled ? 'Disable' : 'Enable'} User
        </MenuItem>
      </Menu>
    </Box>
  );
}
