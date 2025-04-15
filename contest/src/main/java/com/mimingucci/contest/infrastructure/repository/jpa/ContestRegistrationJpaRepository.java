package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationEntity;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContestRegistrationJpaRepository extends JpaRepository<ContestRegistrationEntity, ContestRegistrationId> {
    // Find all registrations for a specific contest with pagination
    Page<ContestRegistrationEntity> findByContest(Long contestId, Pageable pageable);

    // Find all registrations for a specific user
    List<ContestRegistrationEntity> findByUser(Long userId);

    // Count total registrations for a contest
    long countByContest(Long contestId);

    // Find all rated participants in a contest
    List<ContestRegistrationEntity> findByContestAndRatedTrue(Long contestId);

    // Find all participants who have participated in a contest
    List<ContestRegistrationEntity> findByContestAndParticipatedTrue(Long contestId);

    // Find all rated and participated users in a contest
    List<ContestRegistrationEntity> findByContestAndRatedTrueAndParticipatedTrue(Long contestId);

    // Check if user has any rated registrations
    boolean existsByUserAndRatedTrue(Long userId);

    // Delete all registrations for a contest
    void deleteByContest(Long contestId);

    // Find users who registered but didn't participate
    @Query("SELECT cr FROM ContestRegistrationEntity cr " +
            "WHERE cr.contest = :contestId " +
            "AND cr.participated = false")
    List<ContestRegistrationEntity> findNonParticipants(@Param("contestId") Long contestId);

    // Find users who registered for multiple contests
    @Query("SELECT cr.user, COUNT(cr.contest) as contestCount " +
            "FROM ContestRegistrationEntity cr " +
            "GROUP BY cr.user " +
            "HAVING COUNT(cr.contest) > 1")
    List<Object[]> findUsersWithMultipleRegistrations();
}
