package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ContestJpaRepository extends JpaRepository<ContestEntity, Long> {
    // Find by name (exact match)
    ContestEntity findByName(String name);

    // Find contests within a time range
    List<ContestEntity> findByStartTimeAfterAndEndTimeBefore(Instant startAfter, Instant endBefore);

    // Find contests with pagination and filtering
    Page<ContestEntity> findByEnabledTrue(Pageable pageable);

    // Custom query example (contests that are active and not yet started)
    @Query("SELECT c FROM ContestEntity c WHERE c.enabled = true AND c.startTime > :now")
    List<ContestEntity> findActiveUpcomingContests(@Param("now") Instant now);

    Page<ContestEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Find a contest by ID where the startTime is less than or equal to current time
    ContestEntity findByIdAndStartTimeLessThanEqual(Long id, Instant currentTime);

    @Query("SELECT c FROM ContestEntity c WHERE " +
            "NOT (c.endTime < :currentTime OR c.startTime > :periodEnd)")
    List<ContestEntity> findContestsRelevantForPeriod(
            @Param("currentTime") Instant currentTime,
            @Param("periodEnd") Instant periodEnd);
}
