package com.mimingucci.user.presentation.dto.request;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
public class ChatMessageRequest {
    Long id;
    String content;
    Long author;
    ChatMessage.MessageType type;
    Long chat;  // could be userId for 1-1 chat or groupId for group chat
    Instant createdAt;
    Instant updatedAt;
    Map<Long, ChatMessage.MessageReaction> reactions = new HashMap<>(); // reaction type
    Set<Long> isRead = new HashSet<>();

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public enum MessageReaction {
        LIKE, DISLIKE, FUNNY, ANGRY, LOVE, SAD
    }
}
