import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import { FaArrowRightLong, FaClock } from "react-icons/fa6";
import ContestApi from "../../getApi/ContestApi";
import { calculateDuration } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";

const NavbarClock = () => {
  const { t } = useTranslation();

  const [nextContest, setNextContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNextContest = async () => {
    try {
      setLoading(true);
      const response = await ContestApi.getUpcomingContests({
        days: 7,
        type: "SYSTEM",
      });

      if (response?.data?.code === "200" && response.data.data.length > 0) {
        // Sort contests by start time and get the nearest one
        const contests = response.data.data;
        const nearestContest = contests.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        )[0];

        setNextContest(nearestContest);
      }
    } catch (error) {
      console.error("Failed to fetch next contest:", error);
      setError("Failed to load contest information");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!nextContest) return {};

    const startTime = new Date(nextContest.startTime);
    const difference = startTime - new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  useEffect(() => {
    fetchNextContest();
  }, []);

  useEffect(() => {
    if (!nextContest) return;

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      if (timeLeft) {
        setTimeLeft(timeLeft);
      } else {
        clearInterval(timer);
        fetchNextContest(); // Fetch next contest when current one starts
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextContest]);

  if (loading) {
    return (
      <Paper elevation={1} sx={{ mt: 2, p: 3, textAlign: "center" }}>
        <CircularProgress size={24} />
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

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 2,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Header */}
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
          {t("navbar.payAttention")}
        </Typography>
      </Box>

      <Divider />

      {/* Content */}
      {!nextContest ? (
        <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
          <Typography variant="body2" align="center" color="text.secondary">
            {t("navbar.noUpcomingContests")}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FaClock style={{ color: "#1976d2" }} />
            <Typography variant="subtitle2">
              {t("navbar.nextContest")}:
            </Typography>
          </Box>

          <Link
            href={`/contest/${nextContest.id}`}
            underline="hover"
            color="inherit"
            sx={{
              display: "block",
              mb: 2,
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {nextContest.name}
          </Link>

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
              <Box
                key={unit}
                sx={{
                  textAlign: "center",
                  minWidth: 60,
                }}
              >
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
            {t("navbar.duration")}:{" "}
            {calculateDuration(nextContest.startTime, nextContest.endTime)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default NavbarClock;
