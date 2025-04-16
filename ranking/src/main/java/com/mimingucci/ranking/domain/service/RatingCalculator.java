package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.enums.ContestType;
import com.mimingucci.ranking.domain.client.UserClient;
import com.mimingucci.ranking.domain.client.response.UserResponse;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingCalculator {

    private final UserClient userClient;

    /**
     * Calculates rating changes for all participants based on contest results
     * Using an algorithm similar to Codeforces' Elo rating system
     */
    public List<RatingChange> calculateRatingChanges(Long contestId, List<LeaderboardEntry> entries, ContestType contestType) {
        // Get all participants by ID
        List<Long> userIds = entries.stream()
                .map(LeaderboardEntry::getUserId)
                .collect(Collectors.toList());

        // Get current ratings of all participants
        Map<Long, Integer> currentRatings = new HashMap<>();
        for (Long i : userIds) {
            UserResponse userResponse = userClient.getUserById(i).data();
            if (userResponse != null) currentRatings.put(i, userResponse.getRating());
        }

        // Calculate seed values (expected performance)
        Map<Long, Double> seedValues = calculateSeedValues(entries, currentRatings);

        // Calculate actual performance
        Map<Long, Double> actualPerformance = calculateActualPerformance(entries);

        // Apply rating formula
        List<RatingChange> ratingChanges = new ArrayList<>();

        double weight = getContestWeight(contestType);

        for (LeaderboardEntry entry : entries) {
            Long userId = entry.getUserId();
            int oldRating = currentRatings.getOrDefault(userId, 1500);

            // Expected performance minus actual performance
            double expectedPerformance = seedValues.get(userId);
            double performance = actualPerformance.get(userId);

            // Calculate rating change based on the difference between actual and expected performance
            int ratingChange = (int) Math.round((performance - expectedPerformance) * weight);

            // Apply maximum change constraints
            ratingChange = Math.max(-100, Math.min(100, ratingChange));

            int newRating = oldRating + ratingChange;

            // Ensure minimum rating is 1
            newRating = Math.max(1, newRating);

            ratingChanges.add(new RatingChange(
                    userId,
                    contestId,
                    entry.getSolvedProblems().size(),
                    entry.getRank(),
                    oldRating,
                    newRating,
                    newRating - oldRating
            ));
        }

        return ratingChanges;
    }

    /**
     * Calculate the expected performance for each participant based on their ratings
     */
    private Map<Long, Double> calculateSeedValues(List<LeaderboardEntry> entries, Map<Long, Integer> ratings) {
        Map<Long, Double> seedValues = new HashMap<>();
        int n = entries.size();

        for (int i = 0; i < n; i++) {
            LeaderboardEntry participant1 = entries.get(i);
            Long id1 = participant1.getUserId();
            int rating1 = ratings.getOrDefault(id1, 1500);

            double seed = 1.0;

            for (int j = 0; j < n; j++) {
                if (i != j) {
                    LeaderboardEntry participant2 = entries.get(j);
                    Long id2 = participant2.getUserId();
                    int rating2 = ratings.getOrDefault(id2, 1500);

                    // Probability of participant1 winning against participant2
                    seed += 1.0 / (1.0 + Math.pow(10.0, (rating2 - rating1) / 400.0));
                }
            }

            seedValues.put(id1, seed);
        }

        return seedValues;
    }

    /**
     * Calculate actual performance based on contest ranks
     */
    private Map<Long, Double> calculateActualPerformance(List<LeaderboardEntry> entries) {
        Map<Long, Double> performance = new HashMap<>();
        int n = entries.size();

        // Sort entries by rank (although they should already be sorted)
        entries.sort(Comparator.comparingInt(LeaderboardEntry::getRank));

        // Handle ties - participants with the same rank share their positions
        Map<Integer, List<Long>> rankGroups = new HashMap<>();
        for (LeaderboardEntry entry : entries) {
            rankGroups.computeIfAbsent(entry.getRank(), k -> new ArrayList<>())
                    .add(entry.getUserId());
        }

        // Calculate performance for each user
        for (Map.Entry<Integer, List<Long>> group : rankGroups.entrySet()) {
            int rank = group.getKey();
            List<Long> userIds = group.getValue();

            // For tied participants, average their positions
            double avgPosition = userIds.size() > 1 ?
                    rankGroups.entrySet().stream()
                            .filter(e -> e.getKey() < rank)
                            .mapToInt(e -> e.getValue().size())
                            .sum() + (userIds.size() + 1) / 2.0 :
                    rank;

            // Convert position to performance
            double value = n - avgPosition + 1;

            // Assign the same performance value to all users in this rank group
            for (Long userId : userIds) {
                performance.put(userId, value);
            }
        }

        return performance;
    }

    /**
     * Get weight factor based on contest type
     */
    private double getContestWeight(ContestType contestType) {
        switch (contestType) {
            case ContestType.SYSTEM:
                return 1.0;
            default:
                return 0.0;
        }
    }
}
