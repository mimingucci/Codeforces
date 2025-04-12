package com.mimingucci.user.infrastructure.repository.entity;

import com.mimingucci.user.infrastructure.repository.converter.LongSetConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "room")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomEntity {
    @Id
    private Long id;

    private String name; // null for 1-1 chat

    @Convert(converter = LongSetConverter.class)
    private Set<Long> participants = new HashSet<>();

    @Convert(converter = LongSetConverter.class)
    private Set<Long> admins = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "is_group_chat")
    private boolean isGroupChat = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now(); // Set to current UTC time
    }
}
