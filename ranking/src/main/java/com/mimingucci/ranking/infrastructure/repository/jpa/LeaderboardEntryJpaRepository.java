package com.mimingucci.ranking.infrastructure.repository.jpa;

import com.mimingucci.ranking.infrastructure.repository.entity.LeaderboardEntryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaderboardEntryJpaRepository extends JpaRepository<LeaderboardEntryEntity, Long> {

    // Fetch all entries for a contest, sorted by rank
    @Query("SELECT l FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId ORDER BY l.rank ASC")
    List<LeaderboardEntryEntity> findAllByContestIdOrderByRank(@Param("contestId") Long contestId);

    // Fetch paginated entries for a contest, sorted by rank
    @Query("SELECT l FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId ORDER BY l.rank ASC")
    Page<LeaderboardEntryEntity> findByContestIdOrderByRank(
            @Param("contestId") Long contestId,
            Pageable pageable
    );

    // Fetch top N entries for a contest
    @Query("SELECT l FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId AND l.rank <= :topN ORDER BY l.rank ASC")
    List<LeaderboardEntryEntity> findTopNByContestId(
            @Param("contestId") Long contestId,
            @Param("topN") Integer topN
    );

    // Fetch entries around a specific user's rank (useful for showing current user's position)
    @Query("""
            SELECT l FROM LeaderboardEntryEntity l 
            WHERE l.contestId = :contestId 
            AND l.rank BETWEEN 
                (SELECT le.rank - :radius FROM LeaderboardEntryEntity le 
                 WHERE le.contestId = :contestId AND le.userId = :userId) 
                AND 
                (SELECT le.rank + :radius FROM LeaderboardEntryEntity le 
                 WHERE le.contestId = :contestId AND le.userId = :userId) 
            ORDER BY l.rank ASC
            """)
    List<LeaderboardEntryEntity> findEntriesAroundUser(
            @Param("contestId") Long contestId,
            @Param("userId") Long userId,
            @Param("radius") Integer radius
    );

    // Count total participants in a contest
    @Query("SELECT COUNT(l) FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId")
    Long countParticipantsByContestId(@Param("contestId") Long contestId);

    // Find rated participants only
    @Query("SELECT l FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId AND l.rated = true ORDER BY l.rank ASC")
    List<LeaderboardEntryEntity> findRatedParticipantsByContestId(@Param("contestId") Long contestId);

    // Find a specific user's entry in a contest
    @Query("SELECT l FROM LeaderboardEntryEntity l WHERE l.contestId = :contestId AND l.userId = :userId")
    LeaderboardEntryEntity findByContestIdAndUserId(
            @Param("contestId") Long contestId,
            @Param("userId") Long userId
    );
}
