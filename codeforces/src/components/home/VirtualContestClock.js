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
import HandleCookies from "../../utils/HandleCookies";

const VirtualContestClock = () => {
  const [virtualContest, setVirtualContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [isContestStarted, setIsContestStarted] = useState(false);

  const userId = HandleCookies.getCookie("id");

  const fetchVirtualContest = async () => {
    if (!userId || !shouldRefetch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await ContestApi.getVirtualContestIfExists(userId);
      if (response?.data?.code === "200" && response.data.data) {
        const contest = response.data.data;
        const startTime = new Date(contest.startTime);
        const endTime = new Date(contest.endTime);
        const now = new Date();
        
        if (endTime <= now) {
          setVirtualContest(null);
          setShouldRefetch(false);
        } else {
          setVirtualContest(contest);
          setIsContestStarted(startTime <= now);
        }
      } else {
        setVirtualContest(null);
        setShouldRefetch(false);
      }
    } catch (error) {
      console.error("Failed to fetch virtual contest:", error);
      setError("Failed to load virtual contest information");
      setShouldRefetch(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!virtualContest) return { hours: 0, minutes: 0, seconds: 0 };

    const targetTime = isContestStarted ? new Date(virtualContest.endTime) : new Date(virtualContest.startTime);
    const difference = targetTime - new Date();

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    fetchVirtualContest();
    const interval = setInterval(fetchVirtualContest, 60000);
    return () => clearInterval(interval);
  }, [shouldRefetch]);

  useEffect(() => {
    if (!virtualContest) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (!isContestStarted && new Date(virtualContest.startTime) <= new Date()) {
        setIsContestStarted(true);
      } else if (isContestStarted && new Date(virtualContest.endTime) <= new Date()) {
        clearInterval(timer);
        setVirtualContest(null);
        setShouldRefetch(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [virtualContest, isContestStarted]);

  if (!userId) return null;
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
  if (!virtualContest) return null;

  const progress = isContestStarted
    ? ((new Date() - new Date(virtualContest.startTime)) /
        (new Date(virtualContest.endTime) - new Date(virtualContest.startTime))) *
      100
    : 0;

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
        <FaHourglassHalf style={{ color: "#1976d2", marginRight: 8 }} />
        <Typography color="primary" variant="subtitle1">
          {isContestStarted ? "Your Virtual Contest" : "Upcoming Virtual Contest"}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Link
          href={`/virtual-contest/${virtualContest.id}`}
          underline="hover"
          color="inherit"
          sx={{ display: "block", mb: 1 }}
        >
          <Typography variant="h6">Virtual Contest {virtualContest.id}</Typography>
        </Link>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {isContestStarted ? "Time remaining: " : "Starting in: "}
          </Typography>
          
          {/* Time display */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
              mt: 1,
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

          {/* Progress bar */}
          {isContestStarted && (
            <Box
              sx={{
                width: "100%",
                height: 4,
                bgcolor: "grey.200",
                mt: 2,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: "100%",
                  bgcolor: "primary.main",
                  transition: "width 1s linear",
                }}
              />
            </Box>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 1,
            }}
          >
            Total duration: {calculateDuration(virtualContest.startTime, virtualContest.endTime)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default VirtualContestClock;