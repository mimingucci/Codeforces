package com.mimingucci.ranking.infrastructure.repository.jpa;

import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeEntity;
import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RatingChangeJpaRepository extends JpaRepository<RatingChangeEntity, RatingChangeId> {
    // Find all rating changes for a specific user
    List<RatingChangeEntity> findByUserOrderByContestDesc(Long userId);

    // Find all rating changes in a specific contest
    List<RatingChangeEntity> findByContestOrderByRankAsc(Long contestId);

    // Find users with rating changes greater than a specific value
    List<RatingChangeEntity> findByRatingChangeGreaterThan(Integer ratingChange);

    // Find top performers in a contest (by rank)
    List<RatingChangeEntity> findTop10ByContestOrderByRankAsc(Long contestId);

    // Find users who reached their maximum rating in a contest
    @Query("SELECT rc FROM RatingChangeEntity rc WHERE rc.newRating = " +
            "(SELECT MAX(rc2.newRating) FROM RatingChangeEntity rc2 WHERE rc2.user = rc.user)")
    List<RatingChangeEntity> findUsersMaxRating();

    // Find users whose rating changed by more than specified amount in a contest
    List<RatingChangeEntity> findByContestAndRatingChangeGreaterThan(Long contestId, Integer ratingChange);

    // Get the latest rating change for a user
    Optional<RatingChangeEntity> findFirstByUserOrderByContestDesc(Long userId);

    // Find users within a rating range after a contest
    List<RatingChangeEntity> findByContestAndNewRatingBetweenOrderByNewRatingDesc(
            Long contestId, Integer minRating, Integer maxRating);
}
