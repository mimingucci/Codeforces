import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlogApi from "../../getApi/BlogApi";
import icons from "../../utils/icons";
import Comment from "./Comment";
import "../../assets/css/style.css";
import HandleCookies from "../../utils/HandleCookies";
import { GrSend } from "react-icons/gr";
import CommentApi from "../../getApi/CommentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { relativeTime } from "../../utils/timeManufacture";
import Ranking from "./Ranking";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import UserApi from "../../getApi/UserApi";

const {
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
} = icons;

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const VoteButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.grey[400],
  padding: "4px 8px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    color: active ? theme.palette.primary.dark : theme.palette.grey[600],
  },
}));

const BlogDetail = () => {
  const ref = useRef();
  const [p, setP] = useState();
  const [comments, setComments] = useState();
  const [forceupdate, setForceupdate] = useState(false);
  const [text, setText] = useState("");
  let { blog } = useParams();

  const [author, setAuthor] = useState(null);
  const userId = HandleCookies.getCookie("id");

  useEffect(() => {
    // Fetch blog details
    const fetchBlog = async () => {
      try {
        const res = await BlogApi.getBlogById(blog);
        setP(res?.data?.data);

        if (res?.data?.data?.author) {
          const fetchAuthor = async () => {
            try {
              const response = await UserApi.getUserById(
                res?.data?.data?.author
              );
              if (response?.data?.code === "200") {
                setAuthor(response.data.data);
              }
            } catch (error) {
              console.error("Failed to fetch author info:", error);
            }
          };

          fetchAuthor();
        }
      } catch (err) {
        console.log("Error fetching blog:", err);
        showErrorToast("Failed to load blog");
      }
    };

    // Fetch comments separately
    const fetchComments = async () => {
      try {
        const res = await CommentApi.getCommentByBlogId(blog);
        setComments(res?.data?.data || []);
      } catch (err) {
        console.log("Error fetching comments:", err);
        showErrorToast("Failed to load comments");
      }
    };

    fetchBlog();
    fetchComments();
  }, [blog, forceupdate]);

  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      alert("Please login to continue...");
      return;
    }
    try {
      const res = await BlogApi.updateLike({ blog: p.id, accessToken });
      showSuccessToast("Update like successfully");
      setP(res?.data?.data);
    } catch (error) {
      showErrorToast(error?.response?.data);
    }
  };
  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      alert("Please login to continue...");
      return;
    }
    try {
      const res = await BlogApi.updateDislike({ blog: p.id, accessToken });
      showSuccessToast("Update dislike successfully");
      setP(res?.data?.data);
    } catch (error) {
      showErrorToast(error?.response?.data);
    }
  };

  const handleSubmit = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      alert("Please login to write comment");
      return;
    }
    try {
      const res = await CommentApi.createComment({
        blogId: p.id,
        accessToken,
        content: text,
      });
      showSuccessToast("Comment was created successfully");
      setText("");
      ref.current.value = "";
      setForceupdate(!forceupdate);
    } catch (err) {
      showErrorToast("Oww! Something wrong");
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="text-left mt-5">
        <h1 className="text-blue-800 text-[30px] font-bold">
          {<div dangerouslySetInnerHTML={{ __html: p?.title }} />}
        </h1>
        <p className="flex gap-1">
          By{" "}
          <span className="">
            <Link to={"/profile/" + p?.author}>
              <Ranking
                username={author?.username}
                rating={author?.rating}
                title={false}
              />
            </Link>
          </span>
          , {relativeTime(p?.createdAt)}
        </p>
        <div className="border-l-[4px] border-solid border-gray-400 px-3">
          {<div dangerouslySetInnerHTML={{ __html: p?.content }} />}
        </div>
        <div className="flex items-center text-[12px]">
          <RiAttachment2 size={15} />
          Announcement of{" "}
          <span className="text-gray-500 mx-[5px]">
            {p?.tags?.map((tag) => tag.name).join(", ")}
          </span>
        </div>
        {/* Stats */}
        <StatsContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VoteButton
              onClick={handleLike}
              active={p?.likes?.includes(userId)}
              size="small"
            >
              <ThumbUp fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {p?.likes?.length || 0}
              </Typography>
            </VoteButton>

            <VoteButton
              onClick={handleDislike}
              active={p?.dislikes?.includes(userId)}
              size="small"
            >
              <ThumbDown fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {p?.dislikes?.length || 0}
              </Typography>
            </VoteButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Stack direction="row" spacing={2} sx={{ ml: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FaUser />
              <Typography
                component="a"
                href={`/profile/${author?.id}`}
                sx={{ textDecoration: "underline" }}
              >
                {author?.username}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BsCalendar2DateFill />
              <Typography sx={{ textDecoration: "underline" }}>
                {p?.createdAt?.slice(0, 10)}
              </Typography>
            </Box>
          </Stack>
        </StatsContainer>
      </div>

      {/* Comment Input */}
      <Card sx={{ mb: 2, boxShadow: "none" }}>
        <CardContent
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Write something..."
            onChange={(e) => setText(e.target.value)}
            inputRef={ref}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ minWidth: "auto", p: 1 }}
          >
            <GrSend size={24} />
          </Button>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card sx={{ boxShadow: "none" }}>
        <CardContent>
          {comments?.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              comment={comment} // Pass the full comment object
            />
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};
export default BlogDetail;
