import { useEffect, useState } from "react";
import CommentApi from "../../getApi/CommentApi";
import HandleCookies from "../../utils/HandleCookies";
import Ranking from "./Ranking";
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { Box, IconButton, Typography, Avatar, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const VoteButton = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.grey[400],
  padding: '4px 8px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    color: active ? theme.palette.primary.dark : theme.palette.grey[600],
  }
}));

const Comment = ({ id }) => {
  const [comment, setComment] = useState(null);
  const userId = HandleCookies.getCookie("userId");
  const hasLiked = comment?.likes.includes(userId);
  const hasDisliked = comment?.dislikes.includes(userId);

  useEffect(() => {
    CommentApi.getCommentById(id).then((rs) => {
      setComment(rs.data.data);
    });
  }, [id]);
  const handleLike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    try {
      const res = await CommentApi.updateLike({
        comment: comment.id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      alert("Somthing went wrong, try again later");
    }
  };
  const handleDislike = async () => {
    const accessToken = HandleCookies.getCookie("token");
    try {
      const res = await CommentApi.updateDislike({
        comment: comment.id,
        accessToken,
      });
      setComment(res.data.data);
    } catch (error) {
      alert("Somthing went wrong, try again later");
    }
  };
  return (
    <Box sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <div className="flex">
        <div>
          <a
            className="inline-block pr-3"
            href={"/profile/" + comment?.author.username}
          >
            <div className="flex justify-center">
              <img
                src={comment?.author?.avatar}
                className="w-[50px] h-auto"
              />
            </div>
            <Ranking
              username={comment?.author?.username}
              rating={comment?.author?.rating}
              title={false}
            />
          </a>
        </div>

        <div className="inline-block px-3">
          {/* <FaAnglesRight size={10} className="inline-block" /> */}
          <div dangerouslySetInnerHTML={{ __html: comment?.content }} />
        </div>
      </div>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VoteButton 
          onClick={handleLike}
          active={hasLiked}
          size="small"
        >
          <ThumbUp fontSize="small" />
          <Typography 
            variant="caption" 
            sx={{ ml: 0.5 }}
          >
            {comment?.likes?.length || 0}
          </Typography>
        </VoteButton>

        <VoteButton 
          onClick={handleDislike}
          active={hasDisliked}
          size="small"
        >
          <ThumbDown fontSize="small" />
          <Typography 
            variant="caption" 
            sx={{ ml: 0.5 }}
          >
            {comment?.dislikes?.length || 0}
          </Typography>
        </VoteButton>
      </Box>
    </Box>

    <Typography 
      variant="caption" 
      sx={{ 
        display: 'block',
        textAlign: 'right',
        color: 'text.secondary'
      }}
    >
      {comment?.updatedAt?.slice(0, 10)}
    </Typography>
  </Box>
  );
};
export default Comment;
