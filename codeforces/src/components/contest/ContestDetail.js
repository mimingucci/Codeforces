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
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ContestTimer from "./ContestTimer";
import ContestProblems from "./ContestProblems";
import ContestApi from "../../getApi/ContestApi";
import ProblemApi from "../../getApi/ProblemApi";
import ContestLeaderboard from "./ContestLeaderboard";

const ContestDetail = () => {
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

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await ContestApi.getContestById(id);
        setContest(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch contest details:", error);
        setLoading(false);
      }
    };

    fetchContestDetails();
  }, [id]);

  // New useEffect for fetching problems
  useEffect(() => {
    const fetchProblems = async () => {
      if (!contest) return;

      // Only fetch problems if contest has started
      if (new Date(contest.startTime) <= new Date()) {
        try {
          const response = await ProblemApi.getProblemsByContestId(id);
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

  const handleContestStart = () => {
    setShouldRefresh(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Update URL without reloading
    navigate(`/contest/${id}?tab=${newValue}`, { replace: true });
  };

  const isContestStarted = () => {
    if (!contest?.startTime) return false;
    return new Date(contest.startTime) <= new Date();
  };

  const isContestFinished = () => {
    if (!contest?.endTime) return false;
    return new Date(contest.endTime) < new Date();
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
            Contest hasn't started yet
          </Typography>
          <ContestTimer
            startTime={contest?.startTime}
            endTime={contest?.endTime}
            name={contest?.name}
          />
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
          <Tab value="problems" label="Problems" />
          <Tab value="standing" label="Standings" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === "problems" && (
            <ContestProblems
              problems={problems}
              isContestFinished={isContestFinished()}
            />
          )}
          {activeTab === "standing" && <ContestLeaderboard contest={contest} />}
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
              <Box sx={{ ml: "auto" }}>
                <ContestTimer
                  startTime={contest?.startTime}
                  endTime={contest?.endTime}
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
    </>
  );
};

export default ContestDetail;
