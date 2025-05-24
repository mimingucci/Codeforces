import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Chip,
  Tooltip,
} from "@mui/material";
import icons from "../../utils/icons";
import { getRelativeTimeUnix } from "../../utils/dateUtils";
import { FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import ImageUploader from "./ImageUploader";
import CommitGrid from "./CommitGrid";
import Ranking from "./Ranking";
import RatingChart from "./RatingChart";
import { format, parseISO } from "date-fns";
import { convertUnixTimestamp } from "../../utils/dateUtils";

const {
  IoIosChatboxes,
  IoIosSettings,
  IoDocumentText,
  MdEmail,
  FaStar,
  BsCalendar2DateFill,
  FaLocationDot,
  FaChartLine,
} = icons;

const ProfileOverview = ({ id, isHome = false }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    UserApi.getUserById(id)
      .then((res) => {
        setUser(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* User Info Card */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          "& .MuiBox-root": {
            // Target all Box components inside Paper
            textAlign: "left",
          },
          "& .MuiTypography-root": {
            // Target all Typography components
            textAlign: "left",
          },
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            alignItems: "flex-start", // Align items to the start
            justifyContent: "flex-start", // Justify content to the start
          }}
        >
          {/* Left Column - User Details */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Align items to the start
            }}
          >
            {/* Username and Rating */}
            <Box
              sx={{
                mb: 2,
                width: "100%",
                textAlign: "left",
              }}
            >
              <Ranking
                username={user?.username}
                rating={user?.rating}
                title={true}
              />
            </Box>

            {/* Full Name */}
            {(user?.firstname || user?.lastname) && (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {`${user?.firstname} ${user?.lastname}`}
              </Typography>
            )}

            {/* User Details List */}
            <List dense disablePadding>
              {/* Rating */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FaChartLine color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Rating:
                      <Chip
                        label={user?.rating || 0}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItem>

              {/* Location */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FaLocationDot color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Location:
                      <Typography
                        component="span"
                        sx={{ ml: 1, color: "text.secondary" }}
                      >
                        {user?.country || "_"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              {/* Contribution */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FaStar color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Contribution:
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color: "success.main",
                          fontWeight: "bold",
                        }}
                      >
                        {user?.contribution || 0}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              {/* Settings - Conditional Rendering */}
              {isHome && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IoIosSettings color="#1976d2" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={`/setting/${user?.username}`}>
                        Change settings
                      </Link>
                    }
                  />
                </ListItem>
              )}

              {/* Email */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <MdEmail color="#1976d2" />
                </ListItemIcon>
                <ListItemText primary={user?.email || "email"} />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FaClock color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Last visited:
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color:
                            user?.status === "ONLINE"
                              ? "success.main"
                              : "text.secondary",
                          fontWeight:
                            user?.status === "ONLINE" ? "bold" : "regular",
                        }}
                      >
                        {user?.status === "ONLINE"
                          ? "online now"
                          : user?.lastActive
                          ? getRelativeTimeUnix(user.lastActive)
                          : "never"}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>

              {/* Registration Date */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <BsCalendar2DateFill color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Tooltip
                      title={
                        user?.createdAt
                          ? format(
                              convertUnixTimestamp(user.createdAt),
                              "EEEE, MMMM do yyyy 'at' HH:mm:ss"
                            )
                          : "No date available"
                      }
                      arrow
                    >
                      <Box component="span" sx={{ cursor: "help" }}>
                        {`Registered: ${
                          user?.createdAt
                            ? format(
                                convertUnixTimestamp(user.createdAt),
                                "dd/MM/yyyy"
                              )
                            : "time"
                        }`}
                      </Box>
                    </Tooltip>
                  }
                />
              </ListItem>

              {/* Write Blog - Conditional Rendering */}
              {isHome && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <IoDocumentText color="#1976d2" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Link href="/writeblog">Write Blog</Link>}
                  />
                </ListItem>
              )}

              {/* Message */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <IoIosChatboxes color="#1976d2" />
                </ListItemIcon>
                <ListItemText
                  primary={<Link href={isHome ? "/chat" : ``}>Message</Link>}
                />
              </ListItem>
            </List>
          </Grid>

          {/* Right Column - Avatar */}
          <Grid item xs={12} md={4}>
            <ImageUploader user={user} isHome={isHome} />
          </Grid>
        </Grid>
      </Paper>

      {/* Rating Chart */}
      {/* <RatingChart id={id}/> */}

      {/* Commit Grid */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 1,
        }}
      >
        <CommitGrid author={user?.id} day_of_register={user?.createdAt} />
      </Paper>
    </Box>
  );
};
export default ProfileOverview;
