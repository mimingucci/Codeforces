import React from "react";

const ConversationList = ({ conversations, activeConversation, onSelectConversation, currentUser }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="text-lg font-bold">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation) => {
            // Get the other user in the conversation
            const otherUser = conversation.participants.find(
              (p) => p._id !== currentUser?._id
            );
            
            return (
              <div
                key={conversation._id}
                className={`p-3 border-b flex items-center cursor-pointer hover:bg-gray-100 ${
                  activeConversation?._id === conversation._id ? "bg-blue-50" : ""
                } ${conversation.unread ? "font-bold" : ""}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
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
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="font-medium">{otherUser?.username}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </div>
                </div>
                
                {conversation.unread && (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
