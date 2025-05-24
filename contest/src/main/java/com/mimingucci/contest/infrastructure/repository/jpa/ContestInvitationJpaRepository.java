package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestInvitationEntity;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ContestInvitationJpaRepository extends JpaRepository<ContestInvitationEntity, ContestRegistrationId> {
    // Find all invitations for a specific contest
    List<ContestInvitationEntity> findByContest(Long contestId);

    // Find all invitations for a user
    List<ContestInvitationEntity> findByUser(Long userId);

    // Find pending invitations for a user
    List<ContestInvitationEntity> findByUserAndAcceptedIsNull(Long userId);

    // Find accepted invitations for a contest
    List<ContestInvitationEntity> findByContestAndAcceptedTrue(Long contestId);

    // Find rejected invitations for a contest
    List<ContestInvitationEntity> findByContestAndAcceptedFalse(Long contestId);

    // Find all invitations for a contest with pagination
    Page<ContestInvitationEntity> findByContest(Long contestId, Pageable pageable);

    // Count pending invitations for a contest
    @Query("SELECT COUNT(ci) FROM ContestInvitationEntity ci WHERE ci.contest = :contestId AND ci.accepted IS NULL")
    long countPendingInvitations(@Param("contestId") Long contestId);

    // Find recent invitations
    List<ContestInvitationEntity> findByInvitationTimeAfter(Instant time);

    // Find invitations that were responded to within a time period
    @Query("SELECT ci FROM ContestInvitationEntity ci WHERE ci.contest = :contestId AND ci.responseTime BETWEEN :startTime AND :endTime")
    List<ContestInvitationEntity> findResponsesInPeriod(
            @Param("contestId") Long contestId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime
    );

    // Delete expired invitations
    @Query("DELETE FROM ContestInvitationEntity ci WHERE ci.accepted IS NULL AND ci.invitationTime < :expiryTime")
    void deleteExpiredInvitations(@Param("expiryTime") Instant expiryTime);

    // Check if user has any pending invitations
    boolean existsByUserAndAcceptedIsNull(Long userId);

    // Find users with multiple invitations
    @Query("SELECT ci.user, COUNT(ci.contest) as inviteCount " +
            "FROM ContestInvitationEntity ci " +
            "GROUP BY ci.user " +
            "HAVING COUNT(ci.contest) > 1")
    List<Object[]> findUsersWithMultipleInvitations();

}
