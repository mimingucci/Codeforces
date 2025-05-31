import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ContestTimer from "./ContestTimer";
import ContestProblems from "./ContestProblems";
import ContestApi from "../../getApi/ContestApi";
import ProblemApi from "../../getApi/ProblemApi";
import ContestLeaderboard from "./ContestLeaderboard";
import HandleCookies from "../../utils/HandleCookies";
import { toast } from "react-toastify";
import { calculateDuration } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";

const ContestDetail = ({ isVirtual = false }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "problems"
  );
  const [createVirtualModalOpen, setCreateVirtualModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [virtualContest, setVirtualContest] = useState(null);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        if (isVirtual) {
          const userId = HandleCookies.getCookie("id");
          if (!userId) {
            navigate("/404");
          }
          // fetch virtual contest first
          const virtualResponse = await ContestApi.getVirtualContestIfExists(
            userId
          );
          setVirtualContest(virtualResponse.data.data);

          console.log(virtualResponse);
          // check if current user is the creator of the virtual contest
          if (
            userId !== virtualResponse.data.data.user ||
            id !== virtualResponse.data.data.id?.toString()
          ) {
            navigate("/404");
          }

          // fetch original contest detail
          const contestResponse = await ContestApi.getContestById(
            virtualResponse.data.data.contest
          );
          setContest(contestResponse.data.data);
        } else {
          const response = await ContestApi.getContestById(id);
          setContest(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch contest details:", error);
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id, isVirtual]);

  // New useEffect for fetching problems
  useEffect(() => {
    const fetchProblems = async () => {
      if (!contest) return;

      // Only fetch problems if contest has started
      if (new Date(contest.startTime) <= new Date()) {
        try {
          const response = await ProblemApi.getProblemsByContestId(contest.id);
          setProblems(response.data.data);
        } catch (error) {
          console.error("Failed to fetch problems:", error);
        }
      }
    };

    fetchProblems();
  }, [id, contest, shouldRefresh]); // Add contest as dependency to refetch when it's loaded

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const generateHourOptions = () => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  };

  const generateMinuteOptions = () => {
    return Array.from({ length: 12 }, (_, i) =>
      (i * 5).toString().padStart(2, "0")
    );
  };

  const handleCreateVirtual = async () => {
    try {
      const token = HandleCookies.getCookie("token");
      if (!token) {
        toast.error("Please login to create virtual contest");
        return;
      }

      if (!selectedDate || !selectedHour || !selectedMinute) {
        toast.error("Please select date and time");
        return;
      }

      const startTime = new Date(selectedDate);
      startTime.setHours(
        parseInt(selectedHour),
        parseInt(selectedMinute),
        0,
        0
      );

      // Validate if selected time is in the future
      if (startTime <= new Date()) {
        toast.error("Please select a future time");
        return;
      }

      const response = await ContestApi.createVirtualContest({
        accessToken: token,
        contest: contest.id,
        startTime: startTime.toISOString(),
      });

      if (response?.data?.code === "200") {
        toast.success("Virtual contest created successfully!");
        setCreateVirtualModalOpen(false);
        // Reset form
        setSelectedDate("");
        setSelectedHour("");
        setSelectedMinute("");

        navigate(`/virtual-contest/${response.data.data.id}`);
        window.location.reload();
      } else {
        toast.error("Failed to create virtual contest");
      }
    } catch (error) {
      toast.error("Failed to create virtual contest");
    }
  };

  const handleContestStart = () => {
    setShouldRefresh(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Update URL without reloading
    if (isVirtual) {
      navigate(`/virtual-contest/${virtualContest?.id}?tab=${newValue}`, {
        replace: true,
      });
    } else {
      navigate(`/contest/${id}?tab=${newValue}`, { replace: true });
    }
  };

  const isContestStarted = () => {
    if (isVirtual && virtualContest?.startTime) {
      return new Date(virtualContest.startTime) <= new Date();
    }
    if (!contest?.startTime) return false;
    return new Date(contest.startTime) <= new Date();
  };

  const isContestFinished = () => {
    if (isVirtual && virtualContest?.endTime) {
      return new Date(virtualContest.endTime) < new Date();
    }
    if (!contest?.endTime) return false;
    return new Date(contest.endTime) < new Date();
  };

  const getContestTimes = () => {
    if (isVirtual && virtualContest) {
      return {
        startTime: virtualContest?.startTime,
        endTime: virtualContest?.endTime,
      };
    }
    return {
      startTime: contest?.startTime,
      endTime: contest?.endTime,
    };
  };

  const renderContestContent = () => {
    if (!isContestStarted()) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
          }}
        >
          <AccessTime sx={{ fontSize: 60, color: "primary.main" }} />
          <Typography variant="h5" color="primary">
            {t("contestDetail.notStartedYet")}
          </Typography>
          <ContestTimer {...getContestTimes()} name={contest?.name} />
        </Box>
      );
    }

    return (
      <>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab value="problems" label={t("contestDetail.problems")} />
          <Tab value="standing" label={t("contestDetail.standings")} />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === "problems" && (
            <ContestProblems
              problems={problems}
              isContestFinished={isContestFinished()}
              virtualContestId={isVirtual ? virtualContest?.id : null}
            />
          )}
          {activeTab === "standing" && (
            <ContestLeaderboard
              contest={contest}
              virtualContestId={isVirtual ? virtualContest?.id : null}
            />
          )}
        </Box>
      </>
    );
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h5">{contest?.name}</Typography>
              <Chip label={contest?.type} color="primary" size="small" />
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {isContestFinished() && !isVirtual && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCreateVirtualModalOpen(true)}
                  >
                    {t("contestDetail.createVirtualContest")}
                  </Button>
                )}
                <ContestTimer
                  {...getContestTimes()}
                  name={contest?.name}
                  onContestStart={handleContestStart}
                />
              </Box>
            </Box>
            {isContestStarted() && renderContestContent()}
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {!isContestStarted() && renderContestContent()}
      </Container>
      <Dialog
        open={createVirtualModalOpen}
        onClose={() => setCreateVirtualModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("contestDetail.createVirtualContest")}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("contestDetail.contest")}: {contest?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("contestDetail.duration")}:{" "}
              {calculateDuration(contest?.startTime, contest?.endTime)}
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                type="date"
                label={t("contestDetail.date")}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  select
                  label={t("contestDetail.hour")}
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  sx={{ flex: 1 }}
                >
                  {generateHourOptions().map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t("contestDetail.minute")}
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  sx={{ flex: 1 }}
                >
                  {generateMinuteOptions().map((minute) => (
                    <MenuItem key={minute} value={minute}>
                      {minute}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateVirtualModalOpen(false)}>
            {t("contestDetail.cancel")}
          </Button>
          <Button
            onClick={handleCreateVirtual}
            variant="contained"
            disabled={!selectedDate || !selectedHour || !selectedMinute}
          >
            {t("contestDetail.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContestDetail;
