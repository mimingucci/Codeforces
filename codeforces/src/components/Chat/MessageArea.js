import React, { useRef, useEffect } from "react";
import icons from "../../utils/icons";

const { IoSend, IoArrowBack } = icons;

const MessageArea = ({ 
  messages, 
  currentUser, 
  conversation, 
  newMessage, 
  setNewMessage, 
  handleSendMessage 
}) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no conversation is selected
  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  // Find the other user in conversation
  const otherUser = conversation.participants?.find(
    (p) => p._id !== currentUser?._id
  );

  return (
    <>
      {/* Header */}
      <div className="p-3 border-b flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {otherUser?.profileImage ? (
            <img 
              src={otherUser.profileImage} 
              alt={otherUser.username} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-blue-500">
              {otherUser?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-3">
          <div className="font-medium">{otherUser?.username}</div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?._id;
            return (
              <div
                key={message._id}
                className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    isCurrentUser 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                  <div className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t flex">
        <textarea
          className="flex-1 border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          rows="2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <IoSend size={20} />
        </button>
      </div>
    </>
  );
};

export default MessageArea;
