package com.mimingucci.comment.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentEntity {
    @Id
    private Long id;

    @Column(nullable = false)
    private String content;

    private Long author;

    private Long blog;

    private Set<Long> likes = new HashSet<>();

    private Set<Long> dislikes = new HashSet<>();

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public void addLike(Long user) {
        this.likes.add(user);
        if (this.dislikes.contains(user)) dislikes.remove(user);
    }

    public void addDislike(Long user) {
        this.dislikes.add(user);
        if (this.likes.contains(user)) likes.remove(user);
    }
}