import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import UserApi from "../../getApi/UserApi";
import { isSameId } from "../../utils/idUtils";

// Status indicator for online/offline status
const StatusIndicator = styled("div")(({ theme, status }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  position: "absolute",
  bottom: 0,
  right: 0,
  border: "2px solid #fff",
  backgroundColor:
    status === "ONLINE" ? theme.palette.success.main : theme.palette.grey[400],
}));

const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
  currentUser,
}) => {
  const [participantDetails, setParticipantDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch participant details for all conversations
  useEffect(() => {
    const fetchParticipantDetails = async () => {
      if (!conversations.length) return;

      setLoading(true);

      // Get all unique participant IDs (excluding current user)
      const uniqueParticipantIds = [
        ...new Set(
          conversations.flatMap((conversation) =>
            conversation.participants.filter(
              (id) => !isSameId(id, currentUser?.id)
            )
          )
        ),
      ];

      // Fetch details for each participant
      const participantData = {};

      try {
        // Fetch in parallel for better performance
        const detailsPromises = uniqueParticipantIds.map(
          async (participantId) => {
            try {
              const response = await UserApi.getUserById(participantId);
              return { id: participantId, data: response.data.data };
            } catch (error) {
              console.error(`Failed to fetch user ${participantId}`, error);
              return { id: participantId, data: null };
            }
          }
        );

        const results = await Promise.all(detailsPromises);

        // Create a map of id -> user details
        results.forEach((result) => {
          if (result.data) {
            participantData[result.id] = result.data;
          }
        });

        setParticipantDetails(participantData);
      } catch (error) {
        console.error("Error fetching participant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [conversations, currentUser?.id]);

  // Get the other participant for a 1-on-1 conversation
  const getOtherParticipant = (conversation) => {
    const otherParticipantId = conversation.participants.find(
      (id) => !isSameId(id, currentUser?.id)
    );
    return (
      participantDetails[otherParticipantId] || { username: "Unknown User" }
    );
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
      {loading && conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={24} />
        </Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No conversations yet</Typography>
          <Typography variant="caption" color="text.secondary">
            Search for users to start chatting
          </Typography>
        </Box>
      ) : (
        conversations.map((conversation, index) => {
          const otherUser = getOtherParticipant(conversation);
          const isActive = isSameId(activeConversation?.id, conversation.id);
          const userStatus = otherUser?.status || "OFFLINE";
          return (
            <React.Fragment key={conversation.id}>
              <ListItem
                button
                selected={isActive}
                onClick={() =>
                  onSelectConversation({ ...conversation, otherUser })
                }
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
                  <Box sx={{ position: "relative" }}>
                    <Avatar src={otherUser.avatar}>
                      {otherUser.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <StatusIndicator status={userStatus || "OFFLINE"} />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="span">
                      {otherUser.username}
                    </Typography>
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
