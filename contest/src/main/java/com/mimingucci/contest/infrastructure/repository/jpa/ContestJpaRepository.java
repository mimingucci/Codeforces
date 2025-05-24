package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
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

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE c.type = com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType.SYSTEM " +
            "AND c.enabled = true " +
            "AND c.startTime > :now " +
            "AND c.startTime <= :weekFromNow " +
            "ORDER BY c.startTime ASC")
    List<ContestEntity> findUpcomingSystemContests(
            @Param("now") Instant now,
            @Param("weekFromNow") Instant weekFromNow
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE c.enabled = true " +
            "AND c.startTime > :now " +
            "AND c.startTime <= :endDate " +
            "AND c.type = :type " +
            "ORDER BY c.startTime ASC")
    List<ContestEntity> findUpcomingContests(
            @Param("now") Instant now,
            @Param("endDate") Instant endDate,
            @Param("type") ContestType type
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE c.enabled = true " +
            "AND c.endTime < :now " +
            "AND (:type IS NULL OR c.type = :type) " +
            "ORDER BY c.startTime DESC")
    Page<ContestEntity> findPastContests(
            @Param("now") Instant now,
            @Param("type") ContestType type,
            Pageable pageable
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE c.enabled = true " +
            "AND c.startTime <= :now " +
            "AND c.endTime > :now " +
            "AND (:type IS NULL OR c.type = :type) " +
            "ORDER BY c.endTime ASC")
    List<ContestEntity> findRunningContests(
            @Param("now") Instant now,
            @Param("type") ContestType type
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE :userId IN (SELECT coord FROM c.coordinators coord) " +
            "OR :userId IN (SELECT auth FROM c.authors auth) " +
            "OR :userId IN (SELECT test FROM c.testers test) " +
            "ORDER BY c.startTime DESC")
    Page<ContestEntity> findContestsByStaffMember(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE :userId IN (SELECT coord FROM c.coordinators coord) " +
            "OR :userId IN (SELECT auth FROM c.authors auth) " +
            "OR :userId IN (SELECT test FROM c.testers test) " +
            "ORDER BY c.startTime DESC")
    List<ContestEntity> findAllContestsByStaffMember(
            @Param("userId") Long userId
    );

    // Optional: Find contests by staff member with additional filters
    @Query("SELECT c FROM ContestEntity c " +
            "WHERE (c.enabled = :enabled) " +
            "AND (:type IS NULL OR c.type = :type) " +
            "AND (:userId IN (SELECT coord FROM c.coordinators coord) " +
            "OR :userId IN (SELECT auth FROM c.authors auth) " +
            "OR :userId IN (SELECT test FROM c.testers test)) " +
            "ORDER BY c.startTime DESC")
    Page<ContestEntity> findContestsByStaffMemberAndFilters(
            @Param("userId") Long userId,
            @Param("enabled") boolean enabled,
            @Param("type") ContestType type,
            Pageable pageable
    );

    @Query("SELECT c FROM ContestEntity c " +
            "WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:startTime IS NULL OR c.startTime >= :startTime) " +
            "AND (:endTime IS NULL OR c.endTime <= :endTime) " +
            "AND (:type IS NULL OR c.type = :type) " +
            "ORDER BY c.startTime DESC")
    Page<ContestEntity> findContestsWithFilters(
            @Param("name") String name,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("type") ContestType type,
            Pageable pageable
    );
}
