import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UpcomingContests from "./UpcomingContests";
import PastContests from "./PastContests";
import RunningContests from "./RunningContests";

const ContestPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [contestType, setContestType] = useState("system");
  const [activeTab, setActiveTab] = useState(0);

  // Get contest type from URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setContestType(hash.toLowerCase());
    }
  }, [location]);

  const handleContestTypeChange = (event, newValue) => {
    const types = ["system", "icpc", "gym", "normal"];
    setContestType(types[newValue]);
    navigate(`#${types[newValue]}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t("header.contest")}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={["system", "icpc", "gym", "normal"].indexOf(contestType)}
          onChange={handleContestTypeChange}
          aria-label={t("contest.contestTypes")}
        >
          <Tab label={t("contest.systemContests")} />
          <Tab label={t("contest.icpcContests")} />
          <Tab label={t("contest.gymContests")} />
          <Tab label={t("contest.normalContests")} />
        </Tabs>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: "error.main" }}>
          {t("contest.runningContests")}
        </Typography>
        <RunningContests contestType={contestType} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("contest.upcomingContests")}
        </Typography>
        <UpcomingContests contestType={contestType} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("contest.pastContests")}
        </Typography>
        <PastContests contestType={contestType} />
      </Box>
    </Container>
  );
};

export default ContestPage;
