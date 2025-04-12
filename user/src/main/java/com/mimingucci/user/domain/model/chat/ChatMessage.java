package com.mimingucci.user.domain.model.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private Long id;
    private String content;
    private Long author;
    private MessageType type;
    private Long chat;  // could be userId for 1-1 chat or groupId for group chat
    private Instant createdAt;
    private Instant updatedAt;
    private Map<Long, MessageReaction> reactions = new HashMap<>(); // reaction type
    private Set<Long> isRead = new HashSet<>();

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public enum MessageReaction {
        LIKE, DISLIKE, FUNNY, ANGRY, LOVE, SAD
    }
}
