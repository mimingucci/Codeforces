package com.mimingucci.user.infrastructure.repository.entity;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.infrastructure.repository.converter.LongSetConverter;
import com.mimingucci.user.infrastructure.repository.converter.MessageReactionMapConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageEntity {
    @Id
    private Long id;

    private String content;

    private Long author;

    @Enumerated(EnumType.STRING)
    private ChatMessage.MessageType type;

    private Long chat;  // could be userId for 1-1 chat or groupId for group chat

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Convert(converter = MessageReactionMapConverter.class)
    private Map<Long, ChatMessage.MessageReaction> reactions = new HashMap<>(); // reaction type

    @Column(name = "is_read")
    @Convert(converter = LongSetConverter.class)
    private Set<Long> isRead = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now(); // Set to current UTC time
    }
}
