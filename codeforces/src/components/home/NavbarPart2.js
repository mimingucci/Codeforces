import { 
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Skeleton
} from '@mui/material';
import icons from "../../utils/icons";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import Ranking from "./Ranking";

const { FaArrowRightLong } = icons;

const NavbarPart2 = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UserApi.getTopRatings({ limit: 10 })
      .then((res) => {
        setUsers(res.data.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Paper 
      elevation={1}
      sx={{ 
        mt: 2,
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1.5,
        bgcolor: 'action.hover'
      }}>
        <FaArrowRightLong style={{ color: '#1976d2', marginRight: 8 }} />
        <Typography color="primary" variant="subtitle1">
          Top rated
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>#</TableCell>
              <TableCell sx={{ width: '60%' }}>User</TableCell>
              <TableCell sx={{ width: '30%' }}>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : (
              users?.slice(0, 10).map((user, index) => (
                <TableRow 
                  key={user.id}
                  sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/profile/${user.username}`}
                      underline="hover"
                      color="inherit"
                    >
                      <Ranking
                        username={user.username}
                        rating={user.rating}
                        title={false}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>{user.rating}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center',
        p: 1,
        bgcolor: 'action.hover',
        gap: 1
      }}>
        <Link 
          href="/rating"
          underline="hover"
          color="primary"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          View all
          <FaArrowRightLong size={12} />
        </Link>
      </Box>
    </Paper>
  );
};
export default NavbarPart2;
