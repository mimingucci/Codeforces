import React, { useState, useEffect, useRef } from "react";
import ConversationList from "./ConversationList";
import MessageArea from "./MessageArea";
import io from "socket.io-client";
import UserApi from "../../getApi/UserApi";
import HandleCookies from "../../utils/HandleCookies";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  // Get current user info
  useEffect(() => {
    const username = HandleCookies.getCookie("username");
    if (username) {
      UserApi.getUserByUsername(username)
        .then((res) => {
          setUser(res?.data?.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      socketRef.current = io(process.env.REACT_APP_API_URL || "http://localhost:8080");
      
      socketRef.current.emit("login", { userId: user?.id });
      
      // Get user conversations
      fetchConversations();
      
      socketRef.current.on("newMessage", (message) => {
        if (message.conversationId === activeConversation?._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
        // Update conversation list to show new message indicator
        updateConversationWithNewMessage(message);
      });
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user, activeConversation]);

  // Fetch user's conversations
  const fetchConversations = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/conversations/${user._id}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/messages/${conversationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation._id);
    
    // Join socket room for this conversation
    if (socketRef.current) {
      socketRef.current.emit("joinConversation", { conversationId: conversation._id });
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const messageData = {
        senderId: user._id,
        text: newMessage,
        conversationId: activeConversation._id,
      };
      
      // Emit message to server
      socketRef.current.emit("sendMessage", messageData);
      
      // Optimistically add to UI
      setMessages((prevMessages) => [...prevMessages, {
        ...messageData,
        _id: Date.now().toString(),
        createdAt: new Date(),
      }]);
      
      setNewMessage("");
    }
  };

  // Update conversation list when new message arrives
  const updateConversationWithNewMessage = (message) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv._id === message.conversationId 
          ? {
              ...conv,
              lastMessage: message.text,
              updatedAt: new Date(),
              unread: conv._id !== activeConversation?._id
            }
          : conv
      ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  return (
    <div className="flex h-[calc(100vh-120px)] border rounded-md overflow-hidden">
      {/* Left side - Conversation List */}
      <div className="w-1/3 border-r">
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          currentUser={user}
        />
      </div>
      
      {/* Right side - Messages */}
      <div className="w-2/3 flex flex-col">
        <MessageArea 
          messages={messages}
          currentUser={user}
          conversation={activeConversation}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
