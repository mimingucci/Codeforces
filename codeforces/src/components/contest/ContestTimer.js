import { useState, useEffect, useRef } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { differenceInSeconds } from "date-fns";
import { useTranslation } from "react-i18next";
import ContestAlert from "../common/ContestAlert";

const ContestTimer = ({ startTime, endTime, name = "", onContestStart }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const previousStatus = useRef(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      const previousStatusValue = previousStatus.current;

      if (now < start) {
        setStatus(t("contest.before"));
        const diff = differenceInSeconds(start, now);
        setTimeLeft(formatTime(diff));
      } else if (now > end) {
        setStatus(t("contest.finished"));
        setTimeLeft("00:00:00");
        // Show alert only when status changes from Running to Finished
        if (previousStatusValue === t("contest.running")) {
          setAlertOpen(true);
        }
      } else {
        setStatus(t("contest.running"));
        const diff = differenceInSeconds(end, now);
        setTimeLeft(formatTime(diff));
        if (previousStatusValue === t("contest.before")) {
          setAlertOpen(true);
          onContestStart?.();
        }
      }

      previousStatus.current = status;
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, status, onContestStart, t]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getChipColor = () => {
    switch (status) {
      case t("contest.before"):
        return "warning";
      case t("contest.running"):
        return "success";
      case t("contest.finished"):
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip label={status} color={getChipColor()} size="small" />
        <Typography variant="h6" fontFamily="monospace">
          {timeLeft}
        </Typography>
      </Box>
      <ContestAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={
          status === t("contest.running")
            ? t("contest.contestStarted")
            : t("contest.contestEnded")
        }
        message={
          status === t("contest.running")
            ? t("contest.contestStartedMessage", { name })
            : t("contest.contestEndedMessage", { name })
        }
        severity={status === t("contest.running") ? "success" : "info"}
        actionText={t("contest.close")}
      />
    </>
  );
};

export default ContestTimer;
