import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Star as StarIcon,
  Tag as TagIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Event as EventIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import "@vaadin/split-layout";
import Landing from "../CodeEditor/Components/Landing";
import { useEffect, useState } from "react";
import ProblemApi from "../../getApi/ProblemApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HandleCookies from "../../utils/HandleCookies";
import ContestApi from "../../getApi/ContestApi";

// Custom TabPanel component
const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Problem = () => {
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const virtualContestId = searchParams.get('virtual');
  const userId = HandleCookies.getCookie("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (virtualContestId) {
          if (!userId) navigate("/404");
          const virtualContestResponse = await ContestApi.getVirtualContestIfExists(userId);
          if (virtualContestResponse?.data?.code != "200" || virtualContestResponse.data.data.user != userId || virtualContestResponse.data.data.id?.toString() !== virtualContestId) {
            navigate("/404");
          }
        } 
        // Fetch problem data
        const problemResponse = await ProblemApi.getProblem(id);

        if (problemResponse?.data?.code === "200") {
          setProblem(problemResponse.data.data);

          // Check if user is logged in
          const userId = HandleCookies.getCookie("id");
          if (userId) {
            // Check if user can submit
            const canSubmitResponse = await ContestApi.canSubmit({
              contestId: problemResponse.data.data.contest,
              userId: userId,
            });

            setCanSubmit(canSubmitResponse?.data?.code === "200");
          } else {
            setCanSubmit(false);
          }
        } else {
          setProblem(null);
          setCanSubmit(false);
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setProblem(null);
        setCanSubmit(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, virtualContestId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <vaadin-split-layout orientation="vertical">
      {problem ? (
        <Box sx={{ p: 2 }}>
          {/* Tabs at top */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<DescriptionIcon />} label="Statement" />
              <Tab icon={<TagIcon />} label="Tags" />
              <Tab icon={<BarChartIcon />} label="Stats" />
              <Tab icon={<EventIcon />} label="Contest" />
              <Tab icon={<CodeIcon />} label="Solutions" />
            </Tabs>

            {/* Statement Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {problem.title}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1">
                  time limit per test: {problem.timeLimit / 1000} seconds
                </Typography>
                <Typography variant="body1">
                  memory limit per test: {problem.memoryLimit / 1000000}{" "}
                  megabytes
                </Typography>
                <Typography variant="body1">input: standard input</Typography>
                <Typography variant="body1">output: standard output</Typography>
              </Box>
              <div
                dangerouslySetInnerHTML={{ __html: problem?.statement }}
                style={{ textAlign: "left" }}
              />
            </TabPanel>

            {/* Tags Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Problem Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {problem?.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      clickable
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </TabPanel>

            {/* Stats Tab */}
            <TabPanel value={activeTab} index={2}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Problem Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="primary" />
                      <Typography>
                        Author: {problem?.author?.username}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <StarIcon color="primary" />
                      <Typography>Rating: {problem?.rating}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AssignmentTurnedInIcon color="primary" />
                      <Typography>
                        Total Submissions: {problem?.submissions}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </TabPanel>

            {/* Contest Tab */}
            <TabPanel value={activeTab} index={3}>
              {problem?.contest ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Contest Information
                  </Typography>
                  <Button
                    variant="contained"
                    href={`/contest/${problem.contest}`}
                    startIcon={<EventIcon />}
                    sx={{ mt: 2 }}
                  >
                    Go to Contest
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  This problem is not part of any contest
                </Typography>
              )}
            </TabPanel>

            {/* Solutions Tab */}
            <TabPanel value={activeTab} index={4}>
              {problem?.solution ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Available Solutions
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CodeIcon />}
                    href={`/solution/${problem.id}`}
                  >
                    View Solution
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No solutions available yet
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">Cannot fetch problem statements</Typography>
        </Box>
      )}

      {canSubmit ? (
        <div>
          <Landing problem={problem?.id} contest={problem?.contest} virtualContestId={virtualContestId || null} />
        </div>
      ) : (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">
            {HandleCookies.getCookie("token")
              ? "You don't have permission to submit solutions for this problem"
              : "Please log in to submit solutions"}
          </Typography>
          {!HandleCookies.getCookie("token") && (
            <Button variant="contained" href="/login" sx={{ mt: 2 }}>
              Login
            </Button>
          )}
        </Box>
      )}
    </vaadin-split-layout>
  );
};

export default Problem;
