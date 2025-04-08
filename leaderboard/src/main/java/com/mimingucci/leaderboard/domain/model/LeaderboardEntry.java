package com.mimingucci.leaderboard.domain.model;

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

    private Set<Long> solvedProblems = new HashSet<>();

    private Map<Long, Integer> problemAttempts = new HashMap<>();

    private Map<Long, Integer> problemSolveTimes = new HashMap<>();

}
