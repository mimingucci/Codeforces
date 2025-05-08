import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Badge,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// Styled Badge for unread messages
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    backgroundColor: theme.palette.primary.main,
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
}));

const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
  currentUser,
}) => {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
      {conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No conversations yet</Typography>
        </Box>
      ) : (
        conversations.map((conversation, index) => {
          // For 1-1 chats, find the other user
          const otherParticipant = !conversation.isGroupChat
            ? conversation.participants.find((id) => id !== currentUser?.id)
            : null;

          return (
            <React.Fragment key={conversation.id}>
              <ListItem
                button
                selected={activeConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
                sx={{
                  px: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemAvatar>
                  {conversation.isGroupChat ? (
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {conversation.name?.[0]?.toUpperCase()}
                    </Avatar>
                  ) : (
                    <Avatar>
                      {otherParticipant?.username?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" component="span">
                        {conversation.isGroupChat
                          ? conversation.name
                          : otherParticipant?.username}
                      </Typography>
                      {conversation.updatedAt && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(
                            conversation.updatedAt
                          ).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "80%",
                        }}
                      >
                        {conversation.lastMessage || "No messages yet"}
                      </Typography>
                      {conversation.unread && (
                        <StyledBadge variant="dot" overlap="circular" />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < conversations.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          );
        })
      )}
    </List>
  );
};

export default ConversationList;
