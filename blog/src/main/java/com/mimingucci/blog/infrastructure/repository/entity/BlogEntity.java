package com.mimingucci.blog.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
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

    @Column(nullable = false)
    private String content;

    private Long author;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "blog_tags",
            joinColumns = @JoinColumn(name = "blog_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<TagEntity> tags = new HashSet<>();

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

    public void addTag(TagEntity tag) {
        this.tags.add(tag);
    }

    public void removeTag(TagEntity tag) {
        this.tags.remove(tag);
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
