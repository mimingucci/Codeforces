package com.mimingucci.ranking.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {
    private Long userId;

    private Long contestId;

    private Integer rank = -1;

    private Integer totalScore = 0;

    private Integer penalty = 0;

    private Boolean rated = false;

    @JsonDeserialize(as = HashSet.class)
    private Set<Long> solvedProblems = new HashSet<>();

    @JsonDeserialize(as = HashMap.class)
    private Map<Long, Integer> problemAttempts = new HashMap<>();

    @JsonDeserialize(as = HashMap.class)
    private Map<Long, Integer> problemScores = new HashMap<>();

    @JsonDeserialize(as = HashMap.class)
    private Map<Long, Integer> problemSolveTimes = new HashMap<>();

    public LeaderboardEntry(Long userId, Long contestId) {
        this.userId = userId;
        this.contestId = contestId;
    }
}
