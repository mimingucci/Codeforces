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
import { format } from 'date-fns';
// import ContestApi from '../../getApi/ContestApi';
import { pastContests } from '../../data/mockContests';

const PastContests = ({ contestType }) => {
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // const fetchPastContests = async () => {
    //   try {
    //     const response = await ContestApi.getPastContests(contestType, page, rowsPerPage);
    //     setContests(response.data.data);
    //   } catch (error) {
    //     console.error('Failed to fetch past contests:', error);
    //   }
    // };

    // fetchPastContests();
    setContests(pastContests);
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
                <TableCell>{contest.durationHours}h</TableCell>
                <TableCell>{contest.participantCount}</TableCell>
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
        count={-1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default PastContests;