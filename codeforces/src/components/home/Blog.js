import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const {
  FaAnglesRight,
  RiAttachment2,
  BiSolidUpArrow,
  BiSolidDownArrow,
  FaUser,
  BsCalendar2DateFill,
  IoIosChatboxes,
} = icons;

const ContentWrapper = styled(Box)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.grey[400]}`,
  padding: theme.spacing(2),
  marginY: theme.spacing(2),
  maxWidth: '100%'  // Ensure content doesn't overflow
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  width: '100%'  // Take full width
}));

const Blog = ({ blog }) => {
  const [like, setLike] = useState(blog?.likes.length - blog?.dislikes.length);
  const [show, setShow] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      showErrorToast("Please login to continue...");
      return;
    }
    const id = blog?.id;
    try {
      const res = await BlogApi.updateLike({ blog: id, accessToken });
      showSuccessToast("Update like successfully");
      setLike(res?.data?.data?.likes.length - res?.data?.data?.dislikes.length);
    } catch (error) {
      showErrorToast("Update like failed");
    }
  };

  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    if (!accessToken) {
      showErrorToast("Please login to continue...");
      return;
    }
    const id = blog?.id;
    try {
      const res = await BlogApi.updateDislike({ blog: id, accessToken });
      showSuccessToast("Update dislike successfully");
      setLike(res?.data?.data?.likes.length - res?.data?.data?.dislikes.length);
    } catch (error) {
      showErrorToast("Update dislike failed");
    }
  };

  const onDelete = () => {
    BlogApi.delete({
      accessToken: HandleCookies.getCookie("token"),
      id: blog.id,
    }).then((rs) => {
      if (rs?.data?.code === "200") {
        showSuccessToast("Delete blog successfully");
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
        display: deleted ? 'none' : 'block',
        boxShadow: 'none',
        width: '100%'  // Take full width
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header - Left aligned */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'flex-start', 
          mb: 2,
          justifyContent: 'flex-start'  // Align to left
        }}>
          <Typography 
            variant="h4" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'left'  // Ensure text aligns left
            }}
          >
            <Link to={`/blog/${blog?.id}`}>
              <div dangerouslySetInnerHTML={{ __html: blog?.title }} />
            </Link>
          </Typography>
          
          {blog?.author?.username === HandleCookies.getCookie("username") && (
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ ml: 'auto' }}  // Push buttons to right
            >
              <Button 
                variant="contained" 
                color="inherit"
                size="small"
                onClick={() => navigate(`/editblog/${blog?.id}`)}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                color="error"
                size="small"
                onClick={() => setShow(true)}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Box>

        {/* Author info - Left aligned */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            mb: 2
          }}
        >
          <Typography variant="body2" component="span">
            By
          </Typography>
          <Link 
            href={`/profile/${blog?.author}`} 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Ranking
              username={blog?.author?.username}
              rating={blog?.author?.rating}
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
            style={{ textAlign: 'left' }}  // Ensure content aligns left
          />
        </ContentWrapper>

        {/* Full text link */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Link 
            to={`/blog/${blog?.id}`}
            color="primary"
            sx={{ 
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            Full text and comments
          </Link>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <RiAttachment2 size={15} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            Announcement of{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              {blog?.tags.join(", ")}
            </Typography>
          </Typography>
        </Box>

        {/* Stats */}
        <StatsContainer>
          {/* Voting */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLike} size="small">
              <BiSolidUpArrow color={like >= 0 ? '#4caf50' : undefined} />
            </IconButton>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold',
                color: like >= 0 ? 'success.main' : 'error.main',
                mx: 1
              }}
            >
              {like}
            </Typography>
            <IconButton onClick={handleDislike} size="small">
              <BiSolidDownArrow color="#f44336" />
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Meta info */}
          <Stack 
            direction="row" 
            spacing={2}
            sx={{ ml: 'auto' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaUser />
              <Link href={`/profile/${blog?.author?.username}`}>
                {blog?.author?.username}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BsCalendar2DateFill />
              <Typography variant="body2">
                {new Date(blog?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IoIosChatboxes />
              <Typography variant="body2">
                {blog?.comments?.length}
              </Typography>
            </Box>
          </Stack>
        </StatsContainer>
      </CardContent>

      {show && <Overlay setShow={setShow} onDelete={onDelete} />}
    </Card>
  );
};
export default Blog;
