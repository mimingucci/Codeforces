import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { ThumbUpAlt, ThumbDownAlt } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import icons from "../../utils/icons";
import BlogApi from "../../getApi/BlogApi";
import HandleCookies from "../../utils/HandleCookies";
import { toast } from "react-toastify";
import { relativeTime } from "../../utils/timeManufacture";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import Ranking from "./Ranking";
import Overlay from "./Overlay";
import UserApi from "../../getApi/UserApi";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { RiAttachment2, FaUser, BsCalendar2DateFill, IoIosChatboxes } = icons;

const ContentWrapper = styled(Box)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.grey[400]}`,
  padding: theme.spacing(2),
  marginY: theme.spacing(2),
  maxWidth: "100%", // Ensure content doesn't overflow
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  width: "100%", // Take full width
}));

const Blog = ({ blog }) => {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(blog?.likes || []);
  const [dislikes, setDislikes] = useState(blog?.dislikes || []);
  const [show, setShow] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);

  const userId = HandleCookies.getCookie("id");
  const hasLiked = userId && likes.includes(userId);
  const hasDisliked = userId && dislikes.includes(userId);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!blog?.author) return;

      try {
        const response = await UserApi.getUserById(blog.author);
        if (response?.data?.code === "200") {
          setAuthor(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch author info:", error);
      }
    };

    fetchAuthor();
  }, [blog?.author]);

  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      showErrorToast(t("blog.pleaseLogin"));
      return;
    }
    const id = blog?.id;
    try {
      const res = await BlogApi.updateLike({ blog: id, accessToken });
      if (res?.data?.code === "200") {
        setLikes(res.data.data.likes);
        setDislikes(res.data.data.dislikes);
        showSuccessToast(t("blog.likeUpdated"));
      }
    } catch (error) {
      showErrorToast("Failed to update like");
    }
  };

  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      showErrorToast(t("blog.pleaseLogin"));
      return;
    }
    const id = blog?.id;
    try {
      const res = await BlogApi.updateDislike({ blog: id, accessToken });
      if (res?.data?.code === "200") {
        setLikes(res.data.data.likes);
        setDislikes(res.data.data.dislikes);
        showSuccessToast(t("blog.dislikeUpdated"));
      }
    } catch (error) {
      showErrorToast("Failed to update dislike");
    }
  };

  const onDelete = () => {
    BlogApi.delete({
      accessToken: HandleCookies.getCookie("token"),
      id: blog.id,
    }).then((rs) => {
      if (rs?.data?.code === "200") {
        showSuccessToast(t("blog.deleteSuccess"));
        setDeleted(true);
      }
    });
    setShow(false);
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <Card
      sx={{
        mt: 5,
        display: deleted ? "none" : "block",
        boxShadow: "none",
        width: "100%", // Take full width
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header - Left aligned */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            mb: 2,
            justifyContent: "flex-start", // Align to left
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            sx={{
              fontWeight: "bold",
              textAlign: "left", // Ensure text aligns left
            }}
          >
            <Link to={`/blog/${blog?.id}`}>
              <div dangerouslySetInnerHTML={{ __html: blog?.title }} />
            </Link>
          </Typography>

          {author?.id === HandleCookies.getCookie("id") && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ ml: "auto" }} // Push buttons to right
            >
              <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={() => navigate(`/editblog/${blog?.id}`)}
              >
                {t("blog.edit")}
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => setShow(true)}
              >
                {t("blog.delete")}
              </Button>
            </Stack>
          )}
        </Box>

        {/* Author info - Left aligned */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" component="span">
            {t("blog.by")}
          </Typography>
          <Link
            to={`/profile/${author?.id}`}
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Ranking
              username={author?.username}
              rating={author?.rating}
              title={false}
            />
          </Link>
          <Typography variant="body2" component="span">
            , {relativeTime(blog?.createdAt)}
          </Typography>
        </Box>

        {/* Content - Left aligned */}
        <ContentWrapper>
          <div
            dangerouslySetInnerHTML={{ __html: blog?.content }}
            style={{ textAlign: "left" }} // Ensure content aligns left
          />
        </ContentWrapper>

        {/* Full text link */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Link
            to={`/blog/${blog?.id}`}
            color="primary"
            sx={{
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {t("blog.fullTextAndComments")}
          </Link>
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <RiAttachment2 size={15} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {t("blog.announcementOf")}{" "}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {blog?.tags.join(", ")}
            </Typography>
          </Typography>
        </Box>

        {/* Stats */}
        <StatsContainer>
          {/* Voting */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title={hasLiked ? t("blog.unlike") : t("blog.like")}>
                <IconButton
                  onClick={handleLike}
                  sx={{
                    color: hasLiked ? "primary.main" : "action.disabled",
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  <ThumbUpAlt />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                color={hasLiked ? "primary" : "text.secondary"}
                sx={{ minWidth: 20 }}
              >
                {likes.length > 0 ? likes.length : "0"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip
                title={
                  hasDisliked ? t("blog.removeDislike") : t("blog.dislike")
                }
              >
                <IconButton
                  onClick={handleDislike}
                  sx={{
                    color: hasDisliked ? "primary.main" : "action.disabled",
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  <ThumbDownAlt />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                color={hasDisliked ? "primary" : "text.secondary"}
                sx={{ minWidth: 20 }}
              >
                {dislikes.length > 0 ? dislikes.length : "0"}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Meta info */}
          <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FaUser />
              <Link to={`/profile/${author?.id}`}>{author?.username}</Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BsCalendar2DateFill />
              <Typography variant="body2">
                {new Date(blog?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IoIosChatboxes />
              <Typography variant="body2">{blog?.comments?.length}</Typography>
            </Box>
          </Stack>
        </StatsContainer>
      </CardContent>

      {show && <Overlay setShow={setShow} onDelete={onDelete} />}
    </Card>
  );
};
export default Blog;
