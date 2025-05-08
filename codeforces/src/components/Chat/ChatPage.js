import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Send as SendIcon } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import MessageArea from "./MessageArea";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import ChatApi from "../../getApi/ChatApi";
import webSocketService from "../../getApi/ws/WebSocketService";

const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messagesPage, setMessagesPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [connected, setConnected] = useState(false);

  // Get current user info
  useEffect(() => {
    const id = HandleCookies.getCookie("id");
    if (id) {
      UserApi.getUserById(id)
        .then((res) => {
          setUser(res?.data?.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await UserApi.search({ username: debouncedQuery });
        const filteredResults = response.data.data.content.filter(
          (u) => u.id !== user?.id
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchUsers();
  }, [debouncedQuery, user?.id]);

  // Fetch rooms when component mounts and user is loaded
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const accessToken = HandleCookies.getCookie("token");
        if (!accessToken || !user) return;

        setLoading(true);
        const response = await ChatApi.getRooms(accessToken);
        setRooms(response.data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    if (user) {
      const token = HandleCookies.getCookie("token");

      webSocketService.connect(token, () => {
        setConnected(true);

        // Subscribe to personal message queue
        webSocketService.subscribe(
          `/user/${user.id}/queue/messages`,
          handleNewMessage
        );

        // Subscribe to active conversation if any
        if (activeConversation?.id) {
          webSocketService.subscribe(
            `/topic/room.${activeConversation.id}`,
            handleNewMessage
          );
        }
      });

      // Cleanup on unmount
      return () => {
        webSocketService.disconnect();
        setConnected(false);
      };
    }
  }, [user]);

  // Subscribe to new conversation when it changes
  useEffect(() => {
    if (connected && activeConversation?.id) {
      const subscription = webSocketService.subscribe(
        `/topic/room.${activeConversation.id}`,
        handleNewMessage
      );

      return () => subscription.unsubscribe();
    }
  }, [activeConversation?.id, connected]);

  const handleNewMessage = (message) => {
    // Update messages if it's for current conversation
    if (message.chat === activeConversation?.id) {
      setMessages((prev) => [...prev, message]);

      // Scroll to bottom
      setTimeout(() => {
        const messageBox = document.querySelector(".message-box");
        if (messageBox) {
          messageBox.scrollTop = messageBox.scrollHeight;
        }
      }, 100);
    }

    // Update room list with latest message
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === message.chat) {
          return {
            ...room,
            lastMessage: message.content,
            updatedAt: message.createdAt,
          };
        }
        return room;
      })
    );
  };

  const handleUserSelect = async (selectedUser) => {
    // Check if there's already a room with this user
    const existingRoom = rooms.find(
      (room) => !room.isGroupChat && room.participants.includes(selectedUser.id)
    );

    if (existingRoom) {
      setActiveConversation(existingRoom);
      setSearchQuery("");
      setSearchResults([]);
      return;
    }

    // No existing conversation - show empty chat with selected user
    const newRoom = {
      id: null, // temporary null until created on server
      participants: [user.id, selectedUser.id],
      isGroupChat: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      otherUser: selectedUser, // store selected user info for display
    };

    setActiveConversation(newRoom);
    setSearchQuery("");
    setSearchResults([]);
  };

  const createNewRoom = async (otherUser) => {
    try {
      const accessToken = HandleCookies.getCookie("token");
      const roomRequest = {
        participants: [otherUser.id],
        isGroupChat: false,
      };

      const response = await ChatApi.createRoom({
        room: roomRequest,
        accessToken,
      });

      const newRoom = response.data.data;
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    setMessages([]); // Clear existing messages
    setMessagesPage(0); // Reset page
    setHasMoreMessages(true); // Reset has more flag

    if (conversation.id) {
      try {
        setLoadingMessages(true);
        const accessToken = HandleCookies.getCookie("token");
        const response = await ChatApi.getMessages({
          roomId: conversation.id,
          page: 0,
          size: 50,
          accessToken,
        });

        const { content, last } = response.data.data;
        setMessages(content.reverse()); // Usually messages come newest first, we want oldest first
        setHasMoreMessages(!last);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation?.id) return;

    try {
      const messageData = {
        chat: activeConversation.id,
        content: newMessage,
      };

      // Send message through WebSocket
      const sent = webSocketService.send("/app/chat.send", messageData);

      if (sent) {
        // Optimistically add message to UI
        const optimisticMessage = {
          id: Date.now().toString(), // temporary ID
          chat: activeConversation.id,
          content: newMessage,
          author: user.id,
          createdAt: new Date().toISOString(),
          pending: true, // flag for UI to show sending state
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Show error toast/notification
    }
  };

  // Add typing indicator (optional)
  // const handleTyping = (e) => {
  //   if (!activeConversation?.id) return;

  //   // Debounce typing notification
  //   if (typingTimeout.current) {
  //     clearTimeout(typingTimeout.current);
  //   }

  //   typingTimeout.current = setTimeout(() => {
  //     webSocketService.send('/app/chat.typing', activeConversation.id);
  //   }, 500);
  // };

  // Add function to load more messages
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loadingMessages || !activeConversation?.id) return;

    try {
      setLoadingMessages(true);
      const accessToken = HandleCookies.getCookie("token");
      const response = await ChatApi.getMessages({
        roomId: activeConversation.id,
        page: messagesPage + 1,
        size: 20,
        accessToken,
      });

      const { content, last } = response.data.data;
      setMessages((prev) => [...content.reverse(), ...prev]); // Add older messages at the start
      setMessagesPage((prev) => prev + 1);
      setHasMoreMessages(!last);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      {/* Left side - Conversations */}
      <Box
        sx={{
          width: "350px",
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Box */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                width: "320px",
                mt: 1,
                maxHeight: "300px",
                overflow: "auto",
                zIndex: 1000,
              }}
            >
              <List dense>
                {searchResults.map((user) => (
                  <ListItem
                    key={user.id}
                    button
                    onClick={() => handleUserSelect(user)}
                    sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar} alt={user.username}>
                        {user.username[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.username}
                      secondary={user.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Conversations List */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ConversationList
              conversations={rooms}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              currentUser={user}
            />
          )}
        </Box>
      </Box>

      {/* Right side - Messages */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {!connected && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bgcolor: "warning.main",
              color: "warning.contrastText",
              p: 0.5,
              textAlign: "center",
              zIndex: 1000,
            }}
          >
            <Typography variant="caption">
              Connecting to chat server...
            </Typography>
          </Box>
        )}
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6">
                {activeConversation.id
                  ? activeConversation.participants
                      .filter((p) => p !== user?.id)
                      .map((p) => p.username)
                      .join(", ")
                  : activeConversation.otherUser.username}
              </Typography>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
              {activeConversation.id ? (
                <MessageArea
                  messages={messages}
                  currentUser={user}
                  conversation={activeConversation}
                  loadingMessages={loadingMessages}
                  hasMoreMessages={hasMoreMessages}
                  onLoadMore={loadMoreMessages}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    color: "text.secondary",
                  }}
                >
                  <Avatar
                    src={activeConversation.otherUser.avatar}
                    sx={{ width: 80, height: 80 }}
                  >
                    {activeConversation.otherUser.username[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="h6">
                    {activeConversation.otherUser.username}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    This is the beginning of your conversation with{" "}
                    {activeConversation.otherUser.username}
                  </Typography>
                  <Typography variant="body2">
                    Send a message to start chatting
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Write a message...`}
                disabled={!connected}
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!connected || !newMessage.trim()}
                        color="primary"
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Select a conversation or search for users to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ChatPage;
