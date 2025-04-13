package com.mimingucci.contest.infrastructure.repository.entity;

import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "contest")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, name = "start_time")
    private Instant startTime;

    @Column(nullable = false, name = "end_time")
    private Instant endTime;

    private Boolean enabled = true;

    private ContestType type = ContestType.NORMAL;

    @Column(nullable = false, name = "is_public")
    private Boolean isPublic = true;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> coordinators = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> authors = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Long> testers = new HashSet<>();

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(name = "updated_at")
    private Instant updatedAt; // UTC timestamp

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now(); // Set to current UTC time
    }
}
