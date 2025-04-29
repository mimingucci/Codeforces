import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Link
} from '@mui/material';
import { format, set } from 'date-fns';
import ContestApi from '../../getApi/ContestApi';
import { pastContests } from '../../data/mockContests';
import { calculateDuration } from '../../utils/dateUtils';

const PastContests = ({ contestType }) => {
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(-1);

  useEffect(() => {
    const fetchPastContests = async () => {
      try {
        const response = await ContestApi.getPastContests({type: contestType?.toUpperCase(), page, size: rowsPerPage});
        console.log(response.data);
        setContests(response.data?.data?.content);
        setTotalItems(response.data?.data?.totalElements);
      } catch (error) {
        console.error('Failed to fetch past contests:', error);
      }
    };

    fetchPastContests();
  }, [contestType, page, rowsPerPage]);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contests.map((contest) => (
              <TableRow key={contest.id}>
                <TableCell>
                  <Link href={`/contest/${contest.id}`}>
                    {contest.name}
                  </Link>
                </TableCell>
                <TableCell>{contest.type}</TableCell>
                <TableCell>
                  {format(new Date(contest.startTime), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{calculateDuration(contest.startTime, contest.endTime)}</TableCell>
                <TableCell>{0}</TableCell>
                <TableCell>
                  <Link href={`/contest/${contest.id}/standings`}>
                    Standings
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default PastContests;