package com.mimingucci.user.domain.model.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    private String id;
    private String name; // null for 1-1 chat
    private Set<Long> participants = new HashSet<>();
    private Set<Long> admins = new HashSet<>();
    private Instant createdAt;
    private Instant updatedAt;
    private boolean isGroupChat;
}
