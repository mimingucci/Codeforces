import { useEffect, useState } from "react";
import CommentApi from "../../getApi/CommentApi";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
import Ranking from "./Ranking";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Link,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const VoteButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.grey[400],
  padding: "4px 8px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    color: active ? theme.palette.primary.dark : theme.palette.grey[600],
  },
}));

const Comment = ({ id }) => {
  const [comment, setComment] = useState(null);
  const [author, setAuthor] = useState(null);

  const userId = HandleCookies.getCookie("id");
  const hasLiked = userId && comment?.likes.includes(userId);
  const hasDisliked = userId && comment?.dislikes.includes(userId);

  useEffect(() => {
    const fetchCommentAndAuthor = async () => {
      try {
        const commentResponse = await CommentApi.getCommentById(id);
        const comment = commentResponse.data.data;
        setComment(comment);

        // Fetch author info
        if (comment?.author) {
          const authorResponse = await UserApi.getUserById(comment.author);
          setAuthor(authorResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching comment:", error);
      }
    };

    fetchCommentAndAuthor();
  }, [id]);

  const handleLike = async () => {
    if (!userId) return; // Not logged in

    const accessToken = HandleCookies.getCookie("token");
    try {
      const res = await CommentApi.updateLike({
        comment: comment.id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleDislike = async () => {
    if (!userId) return; // Not logged in

    const accessToken = HandleCookies.getCookie("token");
    try {
      const res = await CommentApi.updateDislike({
        comment: comment.id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  return (
    <Box sx={{ py: 2, borderBottom: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <div className="flex">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link
              href={`/profile/${author?.id}`}
              sx={{ textDecoration: "none" }}
            >
              <Avatar
                src={author?.avatar}
                alt={author?.username}
                sx={{
                  width: 48,
                  height: 48,
                  mb: 1,
                }}
              >
                {author?.username?.[0]?.toUpperCase()}
              </Avatar>
            </Link>
            <Ranking
              username={author?.username}
              rating={author?.rating}
              title={false}
            />
          </Box>

          <div className="inline-block px-5">
            {/* <FaAnglesRight size={10} className="inline-block" /> */}
            <Typography
              variant="body1"
              sx={{ mb: 1 }}
              dangerouslySetInnerHTML={{ __html: comment?.content }}
            />{" "}
          </div>
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <VoteButton
            onClick={handleLike}
            disabled={!userId}
            active={hasLiked}
            size="small"
          >
            <ThumbUp fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {comment?.likes?.length || 0}
            </Typography>
          </VoteButton>

          <VoteButton
            onClick={handleDislike}
            disabled={!userId}
            active={hasDisliked}
            size="small"
          >
            <ThumbDown fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {comment?.dislikes?.length || 0}
            </Typography>
          </VoteButton>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "right",
          color: "text.secondary",
        }}
      >
        {comment?.updatedAt?.slice(0, 10)}
      </Typography>
    </Box>
  );
};
export default Comment;
