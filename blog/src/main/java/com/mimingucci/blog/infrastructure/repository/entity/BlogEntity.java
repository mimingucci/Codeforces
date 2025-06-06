package com.mimingucci.blog.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "blog")
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
public class BlogEntity {
    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2048)
    private String content;

    private Long author;

    private List<String> tags = new ArrayList<>();

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(name = "updated_at")
    private Instant updatedAt;

    private Set<Long> likes = new HashSet<>();

    private Set<Long> dislikes = new HashSet<>();

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
