package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.ErrorMessageConstants;
import com.mimingucci.ranking.common.enums.ContestType;
import com.mimingucci.ranking.common.exception.ApiRequestException;
import com.mimingucci.ranking.common.util.LeaderboardFileHandler;
import com.mimingucci.ranking.common.util.SubmissionHistoryFileHandler;
import com.mimingucci.ranking.domain.client.ContestClient;
import com.mimingucci.ranking.domain.client.UserClient;
import com.mimingucci.ranking.domain.client.response.ContestResponse;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import com.mimingucci.ranking.domain.repository.RatingChangeRepository;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingCalculator {

    private final RatingChangeRepository ratingChangeRepository;

    private final LeaderboardEntryRepository leaderboardEntryRepository;

    private final SubmissionResultRepository submissionResultRepository;

    private final ContestClient contestClient;

    private final UserClient userClient;

    public Boolean completeContest(Long contestId) {
        ContestResponse contest = this.contestClient.getContest(contestId).data();
        if (!SubmissionHistoryFileHandler.submissionHistoryFileExists(contestId) || !LeaderboardFileHandler.leaderboardFileExists(contestId)) {
            throw new ApiRequestException(ErrorMessageConstants.CAN_NOT_FIND_DATA, HttpStatus.NOT_FOUND);
        }
        List<LeaderboardEntry> entries = LeaderboardFileHandler.readLeaderboard(contestId);

        submissionResultRepository.saveSubmissionResultEventsDuringContest(SubmissionHistoryFileHandler.readSubmissionHistory(contestId));
        leaderboardEntryRepository.saveLeaderboardEntriesDuringContest(entries);

        List<Pair<Long, Integer>> result = calculateRatingChanges(contestId, entries, contest.getType());

        this.userClient.updateUserRatings(result);

        // clear
        SubmissionHistoryFileHandler.deleteSubmissionHistory(contestId);
        LeaderboardFileHandler.deleteLeaderboardByContestId(contestId);

        return true;
    }

    /**
     * Calculates rating changes for all participants based on contest results
     * Using an algorithm similar to Codeforces' Elo rating system
     */
    public List<Pair<Long, Integer>> calculateRatingChanges(Long contestId, List<LeaderboardEntry> entries, ContestType contestType) {
        if (!contestType.equals(ContestType.SYSTEM)) return new ArrayList<>();

        // Get all participants by ID
        List<Long> userIds = entries.stream()
                .map(LeaderboardEntry::getUserId)
                .toList();

        // Get current ratings of all participants
        Map<Long, Integer> currentRatings = new HashMap<>();
        List<RatingChange> changes = ratingChangeRepository.getNewestChangesInUserIds(userIds);

        for (var i : changes) {
            currentRatings.put(i.getUser(), i.getNewRating());
        }

        Set<Long> setChanges = changes.stream().map(RatingChange::getUser).collect(Collectors.toSet());
        for (var i : userIds) {
            if (!setChanges.contains(i)) {
                currentRatings.put(i, 0);
            }
        }

        // Calculate seed values (expected performance)
        Map<Long, Double> seedValues = calculateSeedValues(entries, currentRatings);

        // Calculate actual performance
        Map<Long, Double> actualPerformance = calculateActualPerformance(entries);

        // Apply rating formula
        List<RatingChange> ratingChanges = new ArrayList<>();

        List<Pair<Long, Integer>> response = new ArrayList<>();

        double weight = getContestWeight(contestType);

        for (LeaderboardEntry entry : entries) {
            Long userId = entry.getUserId();
            int oldRating = currentRatings.getOrDefault(userId, 0);

            // Expected performance minus actual performance
            double expectedPerformance = seedValues.get(userId);
            double performance = actualPerformance.get(userId);

            // Calculate rating change based on the difference between actual and expected performance
            int ratingChange = (int) Math.round((performance - expectedPerformance) * weight);

            if (entry.getRated() == null || entry.getRated().equals(Boolean.FALSE)) ratingChange = 0;

            int newRating = oldRating + ratingChange;

            // Ensure minimum rating is 0
            newRating = Math.max(0, newRating);

            ratingChanges.add(new RatingChange(
                    userId,
                    contestId,
                    entry.getSolvedProblems().size(),
                    entry.getRank(),
                    oldRating,
                    newRating,
                    newRating - oldRating
            ));

            response.add(Pair.of(userId, newRating));
        }

        ratingChangeRepository.persistBatch(ratingChanges);
        return response;
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
            int rating1 = ratings.getOrDefault(id1, 0);

            double seed = 1.0;

            for (int j = 0; j < n; j++) {
                if (i != j) {
                    LeaderboardEntry participant2 = entries.get(j);
                    Long id2 = participant2.getUserId();
                    int rating2 = ratings.getOrDefault(id2, 0);

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
