import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import SubmissionApi from "../../getApi/SubmissionApi";
import ContestApi from "../../getApi/ContestApi";
import HandleCookies from "../../utils/HandleCookies";
import { Close as CloseIcon, Lock as LockIcon } from "@mui/icons-material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const StyledId = ({ id }) => (
  <Typography
    component="span"
    sx={{
      color: "primary.main",
      textDecoration: "underline",
      cursor: "pointer",
      fontFamily: "monospace",
      fontWeight: "medium",
    }}
  >
    {id}
  </Typography>
);

const UserSubmissions = ({ userId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [checkingLock, setCheckingLock] = useState(false);

  // Check if user is currently in a contest (locked)
  const checkContestLock = async () => {
    try {
      setCheckingLock(true);
      const currentUserId = HandleCookies.getCookie("id");

      // Only check lock if viewing own submissions
      if (currentUserId && currentUserId !== userId) {
        const response = await ContestApi.lockSubmissionApi(userId);
        setIsLocked(
          response?.data?.code === "200" && response?.data?.data === true
        );
      } else {
        // Always restrict viewing other users' code during contests
        setIsLocked(false);
      }
    } catch (error) {
      console.error("Failed to check contest lock:", error);
      // Default to locked for safety in case of errors
      setIsLocked(true);
    } finally {
      setCheckingLock(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = HandleCookies.getCookie("token");
      const response = await SubmissionApi.getAllSubmissions(
        userId,
        token,
        page,
        rowsPerPage
      );

      if (response?.code === "200") {
        setSubmissions(response.data.content);
        setTotal(response.data.totalElements);
      } else {
        console.error("Failed to fetch submissions:", response?.message);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    checkContestLock();
  }, [page, rowsPerPage, userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmissionClick = async (submission) => {
    // Re-check lock status before showing code
    await checkContestLock();

    if (isLocked) {
      // Show modal with locked message instead of code
      setSelectedSubmission(submission);
      setOpenModal(true);
      return;
    }

    setSelectedSubmission(submission);
    setOpenModal(true);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "ACCEPTED":
        return "success";
      case "WRONG_ANSWER":
        return "error";
      case "TIME_LIMIT_EXCEEDED":
        return "warning";
      case "MEMORY_LIMIT_EXCEEDED":
        return "warning";
      case "RUNTIME_ERROR":
        return "error";
      case "COMPILATION_ERROR":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLocked && (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<LockIcon />}>
          Source code is hidden during contests. You can view submission
          details, but code is not available.
        </Alert>
      )}

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          {(loading || checkingLock) && <LinearProgress />}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>When</TableCell>
                <TableCell>Problem</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Verdict</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Memory</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  hover
                  onClick={() => handleSubmissionClick(submission)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <StyledId id={submission.id?.toString()} />
                  </TableCell>
                  <TableCell>
                    {new Date(submission.sent).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/problem/${submission.problem?.toString()}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "#2196f3",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {submission.problem?.toString()}
                    </Link>
                  </TableCell>
                  <TableCell>{submission.language?.toString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={submission?.verdict}
                      color={getVerdictColor(submission?.verdict)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{submission?.execution_time_ms || 0} ms</TableCell>
                  <TableCell>
                    {submission.memory_used_bytes != null
                      ? `${Math.round(submission.memory_used_bytes / 1024)} KB`
                      : "0 KB"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "80vh",
            width: "75vw",
            maxWidth: "75vw",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>
              Submission <StyledId id={selectedSubmission?.id?.toString()} />
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Problem:{" "}
              <Link
                to={`/problem/${selectedSubmission?.problem?.toString()}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: "#2196f3" }}
              >
                {selectedSubmission?.problem?.toString()}
              </Link>
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Verdict:
              <Chip
                label={selectedSubmission?.verdict?.toString()}
                color={getVerdictColor(selectedSubmission?.verdict?.toString())}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="subtitle2">
              Time: {selectedSubmission?.execution_time_ms || 0} ms | Memory:{" "}
              {Math.round((selectedSubmission?.memory_used_bytes || 0) / 1024)}{" "}
              KB
            </Typography>
            <Typography variant="subtitle2">
              Sent:{" "}
              {selectedSubmission?.sent
                ? new Date(selectedSubmission.sent).toLocaleString()
                : "N/A"}
            </Typography>
            {selectedSubmission?.judged && (
              <Typography variant="subtitle2">
                Judged: {new Date(selectedSubmission.judged).toLocaleString()}
              </Typography>
            )}
          </Box>

          {isLocked ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                flex: 1,
                bgcolor: "action.hover",
                borderRadius: 1,
                p: 4,
              }}
            >
              <LockIcon fontSize="large" color="warning" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Source code is hidden during contests
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Source code viewing is disabled while a contest is in progress.
                You can view code after the contest ends.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <SyntaxHighlighter
                language={selectedSubmission?.language?.toLowerCase()}
                style={materialDark}
                customStyle={{
                  margin: 0,
                  height: "100%",
                }}
              >
                {selectedSubmission?.sourceCode || ""}
              </SyntaxHighlighter>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserSubmissions;
