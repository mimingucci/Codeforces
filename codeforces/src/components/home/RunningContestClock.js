import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import { FaArrowRightLong, FaHourglassHalf } from "react-icons/fa6";
import ContestApi from "../../getApi/ContestApi";
import { calculateDuration } from "../../utils/dateUtils";

const RunningContestClock = () => {
  const [runningContest, setRunningContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRunningContest = async () => {
    try {
      setLoading(true);
      const response = await ContestApi.getRunningContests({ type: "SYSTEM" });

      if (response?.data?.code === "200" && response.data.data.length > 0) {
        // Get the first running contest
        setRunningContest(response.data.data[0]);
      } else {
        setRunningContest(null);
      }
    } catch (error) {
      console.error("Failed to fetch running contest:", error);
      setError("Failed to load contest information");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!runningContest) return {};

    const endTime = new Date(runningContest.endTime);
    const difference = endTime - new Date();

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  useEffect(() => {
    fetchRunningContest();
    const interval = setInterval(fetchRunningContest, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!runningContest) return;

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      if (timeLeft) {
        setTimeLeft(timeLeft);
      } else {
        clearInterval(timer);
        fetchRunningContest(); // Refresh when contest ends
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [runningContest]);

  if (loading) {
    return (
      <Paper elevation={1} sx={{ mt: 2, p: 2, textAlign: "center" }}>
        <CircularProgress size={20} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
        <Typography color="error" variant="body2" align="center">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!runningContest) return null;

  // Calculate progress percentage
  const progress =
    ((new Date() - new Date(runningContest.startTime)) /
      (new Date(runningContest.endTime) - new Date(runningContest.startTime))) *
    100;

  return (
    <Paper elevation={1} sx={{ mt: 2, borderRadius: 1, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          bgcolor: "action.hover",
        }}
      >
        <FaArrowRightLong style={{ color: "#1976d2", marginRight: 8 }} />
        <Typography color="primary" variant="subtitle1">
          Contest in progress
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <FaHourglassHalf style={{ color: "#1976d2" }} />
          <Typography variant="subtitle2">Running Contest:</Typography>
        </Box>

        <Link
          href={`/contest/${runningContest.id}`}
          underline="hover"
          color="inherit"
          sx={{
            display: "block",
            mb: 2,
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
        >
          {runningContest.name}
        </Link>

        {/* Progress bar */}
        <Box
          sx={{
            width: "100%",
            height: 4,
            bgcolor: "grey.200",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: `${Math.min(progress, 100)}%`,
              height: "100%",
              bgcolor: "primary.main",
              borderRadius: 1,
              transition: "width 1s linear",
            }}
          />
        </Box>

        {/* Time remaining */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            p: 2,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <Box key={unit} sx={{ textAlign: "center", minWidth: 60 }}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {String(value).padStart(2, "0")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                {unit}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
          }}
        >
          Total duration:{" "}
          {calculateDuration(runningContest.startTime, runningContest.endTime)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RunningContestClock;
