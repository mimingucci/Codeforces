import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
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
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ProblemApi from "../../getApi/ProblemApi";
import LeaderboardApi from "../../getApi/LeaderboardApi";
import UserApi from "../../getApi/UserApi";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

// Score cell component
const ScoreCell = ({ attempts, solveTime, t }) => {
  if (!attempts) return "-";

  if (!solveTime && solveTime !== 0) {
    return (
      <Tooltip title={t("contest.failedAttempts", { count: attempts })}>
        <Box
          sx={{
            color: "error.main",
            fontWeight: "bold",
          }}
        >
          -{attempts}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={t("contest.solvedInMinutes", { minutes: solveTime, attempts })}
    >
      <Box
        sx={{
          color: "success.main",
          fontWeight: "bold",
        }}
      >
        +{solveTime}
        {attempts > 1 && (
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            ({attempts})
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

const ContestLeaderboard = ({ contest, virtualContestId = null }) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [error, setError] = useState(null);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch problems and leaderboard in parallel
        const [problemsResponse, leaderboardResponse] = await Promise.all([
          ProblemApi.getProblemsByContestId(contest.id),
          virtualContestId
            ? LeaderboardApi.getVirtualLeaderboard(virtualContestId)
            : LeaderboardApi.getLeaderboard(contest.id),
        ]);

        setProblems(problemsResponse.data.data);
        setLeaderboard(leaderboardResponse.data.data);

        // Fetch user info for all unique userIds
        const userIds = [
          ...new Set(
            leaderboardResponse.data.data.map((entry) => entry.userId)
          ),
        ];
        const userInfoMap = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const res = await UserApi.getUserById(userId);
              userInfoMap[userId] = res.data.data;
            } catch (e) {
              userInfoMap[userId] = { username: userId }; // fallback
            }
          })
        );
        setUserMap(userInfoMap);
      } catch (error) {
        console.error("Failed to fetch contest data:", error);
        setError("Failed to load contest data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contest.id, virtualContestId]);

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

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("contest.rank")}</StyledTableCell>
              <StyledTableCell>{t("contest.user")}</StyledTableCell>
              <StyledTableCell align="right">
                {t("contest.score")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {t("contest.penalty")}
              </StyledTableCell>
              {problems.map((problem, index) => (
                <StyledTableCell key={problem.id} align="center">
                  {problem.title.charAt(0)}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageData().map((entry) => (
              <StyledTableRow key={entry.userId}>
                <TableCell>{entry.rank}</TableCell>
                <TableCell>
                  <Link href={`/profile/${entry.userId}`} color="primary">
                    {userMap[entry.userId]?.username || entry.userId}
                  </Link>
                </TableCell>
                <TableCell align="right">{entry.totalScore}</TableCell>
                <TableCell align="right">{entry.penalty}</TableCell>
                {problems.map((problem) => {
                  return (
                    <TableCell key={problem.id} align="center">
                      <ScoreCell
                        attempts={entry.problemAttempts[problem.id] || 0}
                        solveTime={entry.problemSolveTimes[problem.id]}
                        t={t}
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
          borderColor: "divider",
        }}
      />
    </Paper>
  );
};

export default ContestLeaderboard;
