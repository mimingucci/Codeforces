import icons from "../../utils/icons";
import HandleCookies from "../../utils/HandleCookies";
import { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";
const { FaArrowRightLong, FaStar, GoDotFill } = icons;

let userId = HandleCookies.getCookie("id") || "";
const NavbarPart1 = () => {
  const { t } = useTranslation();

  const [detain, setDetain] = useState();

  const checkLogin = () => {
    if (HandleCookies.getCookie("id")?.length > 0) {
      userId = HandleCookies.getCookie("id") || "";
      return true;
    }
    return false;
  };

  const getDetainUser = () => {
    UserApi.getUserById(userId).then((res) => setDetain(res?.data?.data));
  };

  useEffect(() => {
    if (checkLogin()) {
      getDetainUser();
    }
  }, []);

  if (!checkLogin()) return null;

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
          {detain?.username || t("navbar.username")}
        </Typography>
      </Box>

      <Divider />

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          p: 2,
          gap: 2,
        }}
      >
        {/* Left side - Links */}
        <Box sx={{ flex: "1 1 60%" }}>
          <List dense disablePadding>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FaStar style={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText
                primary={`${t("navbar.rating")}: ${detain?.rating || "0"}`}
                sx={{ "& .MuiListItemText-primary": { fontSize: "0.9rem" } }}
              />
            </ListItem>

            {[
              {
                text: t("navbar.settings"),
                link: `/setting/${detain?.username}`,
              },
              {
                text: t("navbar.blogs"),
                link: `/userblog/${detain?.username}`,
              },
              { text: t("navbar.talks"), link: "/chat" },
            ].map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <GoDotFill style={{ color: "#1976d2" }} />
                </ListItemIcon>
                <ListItemText>
                  <Link
                    href={item.link}
                    underline="hover"
                    color="inherit"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    {item.text}
                  </Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right side - Avatar */}
        <Box
          sx={{
            flex: "1 1 40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Link href={`/profile/${detain?.id}`}>
            <Avatar
              src={detain?.avatar}
              alt={detain?.username}
              sx={{
                width: 80,
                height: 80,
                "&:hover": {
                  opacity: 0.8,
                  transition: "opacity 0.2s",
                },
              }}
            />
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};
export default NavbarPart1;
