import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { isSameId } from "../../utils/idUtils";
import { convertUnixTimestamp } from "../../utils/dateUtils";

// Styled components for messages
const MessageBubble = styled(Paper)(({ theme, owner }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "70%",
  borderRadius: owner ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
  backgroundColor: owner ? theme.palette.primary.main : theme.palette.grey[100],
  color: owner
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
}));

const TimeStamp = styled(Typography)(({ theme, owner }) => ({
  fontSize: "0.75rem",
  marginTop: 4,
  textAlign: owner ? "right" : "left",
  color: owner ? theme.palette.primary.light : theme.palette.text.secondary,
}));

const MessageArea = ({
  messages,
  currentUser,
  conversation,
  loadingMessages,
  hasMoreMessages,
  onLoadMore,
}) => {
  const messagesEndRef = useRef(null);
  const messageBoxRef = useRef(null);

  // Handle infinite scroll
  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0 && hasMoreMessages && !loadingMessages) {
      const oldHeight = element.scrollHeight;
      onLoadMore().then(() => {
        // Maintain scroll position after loading more messages
        element.scrollTop = element.scrollHeight - oldHeight;
      });
    }
  };

  if (!conversation) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Select a conversation to start chatting
        </Typography>
      </Box>
    );
  }

  const otherUser = conversation.participants?.find(
    (p) => p !== currentUser?.id
  );

  return (
    <Box
      ref={messageBoxRef}
      className="message-box"
      onScroll={handleScroll}
      sx={{
        flexGrow: 1,
        p: 3,
        overflow: "auto",
        bgcolor: (theme) => theme.palette.grey[50],
      }}
    >
      {/* Loading indicator for more messages */}
      {loadingMessages && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {messages.length === 0 ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No messages yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Start the conversation with {otherUser?.username}
          </Typography>
        </Box>
      ) : (
        messages.map((message) => {
          const isOwner = isSameId(message.author, currentUser?.id);
          return (
            <Fade in key={message.id}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: isOwner ? "flex-end" : "flex-start",
                }}
              >
                {!isOwner && (
                  <Avatar
                    src={otherUser?.avatar}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  >
                    {otherUser?.username?.[0]?.toUpperCase()}
                  </Avatar>
                )}
                <Box>
                  <MessageBubble
                    owner={isOwner}
                    elevation={0}
                    sx={{
                      opacity: message.pending ? 0.6 : 1,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2">{message.content}</Typography>
                  </MessageBubble>
                  <TimeStamp variant="caption" owner={isOwner}>
                    {convertUnixTimestamp(message.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TimeStamp>
                </Box>
              </Box>
            </Fade>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageArea;
