import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import BlogApi from "../../getApi/BlogApi";
import Ranking from "./Ranking";
import { useTranslation } from "react-i18next";

const { FaArrowRightLong } = icons;

const NavbarPart4 = () => {
  const { t } = useTranslation();

  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BlogApi.recentlyActive({ page: 1 })
      .then((res) => {
        setBlogs(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          {t("navbar.recentActions")}
        </Typography>
      </Box>

      <Divider />

      {/* Content */}
      <List sx={{ py: 0 }}>
        {loading
          ? // Loading skeleton
            Array.from(new Array(5)).map((_, index) => (
              <ListItem key={index} divider>
                <ListItemText>
                  <Skeleton />
                </ListItemText>
              </ListItem>
            ))
          : blogs?.map((blog) => (
              <ListItem
                key={blog?._id}
                divider
                sx={{
                  py: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                    transition: "background-color 0.2s",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href={`/profile/${blog?.author?.username}`}
                    underline="hover"
                    color="inherit"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Ranking
                      username={blog?.author?.username}
                      rating={blog?.author?.rating}
                      title={false}
                    />
                  </Link>

                  <FaArrowRightLong size={12} style={{ color: "#1976d2" }} />

                  <Link
                    href={`/blog/${blog?._id}`}
                    underline="hover"
                    color="inherit"
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog?.title}
                  </Link>
                </Box>
              </ListItem>
            ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          bgcolor: "action.hover",
        }}
      >
        <Link
          href="/recent-actions"
          underline="hover"
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {t("navbar.viewAllActions")}
          <FaArrowRightLong size={12} />
        </Link>
      </Box>
    </Paper>
  );
};
export default NavbarPart4;
