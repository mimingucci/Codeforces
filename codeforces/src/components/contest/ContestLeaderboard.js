import { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Link,
    Tooltip,
    CircularProgress,
    tableCellClasses,
    TablePagination
  } from '@mui/material';
import { styled } from '@mui/material/styles';
import { mockLeaderboardData } from '../../data/mockLeaderboard';

// Styled components for better visualization
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

// Score cell component
const ScoreCell = ({ attempts, solveTime }) => {
  if (!solveTime) return '-';
  
  return (
    <Tooltip title={`Solved in ${solveTime} minutes (${attempts} attempts)`}>
      <Box sx={{ 
        color: attempts === 1 ? 'success.main' : 'warning.main',
        fontWeight: 'bold'
      }}>
        +{solveTime}
        {attempts > 1 && <Typography variant="caption" sx={{ ml: 0.5 }}>({attempts})</Typography>}
      </Box>
    </Tooltip>
  );
};

const ContestLeaderboard = ({ contest }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState(['A', 'B', 'C']); // Replace with actual problems
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalContestants, setTotalContestants] = useState(0);  

  useEffect(() => {
    // Simulating API call
    const fetchLeaderboard = async () => {
      try {
        // Replace with actual API call
        // const response = await LeaderboardApi.getContestLeaderboard(contest.id);
        // setLeaderboard(response.data);
        setLeaderboard(mockLeaderboardData);
        setTotalContestants(mockLeaderboardData.length);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contest, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate current page data
  const getCurrentPageData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, leaderboard.length);
    return leaderboard.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2}>
       <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
               <StyledTableCell>Rank</StyledTableCell>
               <StyledTableCell>User</StyledTableCell>
               <StyledTableCell align="right">Score</StyledTableCell>
               <StyledTableCell align="right">Penalty</StyledTableCell>
               {
                problems.map((problem, index) => (
                    <StyledTableCell key={index} align="center">
                        {problem}
                    </StyledTableCell>
                ))
               }
            </TableRow>
          </TableHead>
        <TableBody>
          {getCurrentPageData().map((entry) => (
            <StyledTableRow key={entry.userId}>
              <TableCell>{entry.rank}</TableCell>
              <TableCell>
                <Link href={`/profile/${entry.userId}`} color="primary">
                  User {entry.userId}
                </Link>
              </TableCell>
              <TableCell align="right">{entry.totalScore}</TableCell>
              <TableCell align="right">{entry.penalty}</TableCell>
              {problems.map((problem, index) => {
                const problemId = index + 1;
                return (
                  <TableCell key={problemId} align="center">
                    <ScoreCell
                      attempts={entry.problemAttempts[problemId]}
                      solveTime={entry.problemSolveTimes[problemId]}
                    />
                  </TableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      <TablePagination
        component="div"
        count={leaderboard.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
        sx={{
          borderTop: 1,
          borderColor: 'divider'
        }}
      />
    </Paper>
  );
};

export default ContestLeaderboard;