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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { blue, orange } from '@mui/material/colors';

// Mock data interface
interface User {
  id: number;
  username: string;
  email: string;
  rating: number;
  role: 'ADMIN' | 'USER';
  enabled: boolean;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    username: 'tourist',
    email: 'tourist@example.com',
    rating: 3800,
    role: 'USER',
    enabled: true,
  },
  {
    id: 2,
    username: 'Petr',
    email: 'petr@example.com',
    rating: 3500,
    role: 'ADMIN',
    enabled: true,
  },
  {
    id: 3,
    username: 'jiangly',
    email: 'jiangly@example.com',
    rating: 3300,
    role: 'USER',
    enabled: true,
  },
  {
    id: 4,
    username: 'ecnerwala',
    email: 'ecnerwala@example.com',
    rating: 3200,
    role: 'USER',
    enabled: false,
  },
  // Add more mock data as needed
];

const getRatingColor = (rating: number): string => {
  if (rating >= 3000) return '#FF0000';
  if (rating >= 2600) return orange[500];
  if (rating >= 2200) return blue[500];
  return '#808080';
};

export default function UserManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: blue[700] }}>
        User Management
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by username or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: blue[50] }}>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
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
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? 'Active' : 'Disabled'}
                      size="small"
                      color={user.enabled ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {/* Add your action buttons here */}
                    <IconButton size="small" color="primary">
                      {/* Add icons for edit, delete, etc. */}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
