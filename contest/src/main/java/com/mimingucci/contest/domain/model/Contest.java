package com.mimingucci.contest.domain.model;

import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import lombok.Data;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
public class Contest {
    private Long id;

    private String name;

    private Instant startTime;

    private Instant endTime;

    private Set<Long> authors;

    private Set<Long> testers;

    private Set<Long> coordinators;

    private Boolean enabled;

    private ContestType type;

    private Long createdBy;

    private Boolean isPublic;

    public boolean hasPermission(Long userId) {
        return this.getAuthors().contains(userId) || this.getCoordinators().contains(userId) || this.getTesters().contains(userId);
    }

    public void becomeAuthor(Long userId) {
        this.authors.add(userId);
    }

    public void becomeTester(Long userId) {
        this.testers.add(userId);
    }

    public void becomeCoordinator(Long userId) {
        this.coordinators.add(userId);
    }
}
