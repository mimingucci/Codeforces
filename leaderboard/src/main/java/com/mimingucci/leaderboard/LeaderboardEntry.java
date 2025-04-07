package com.mimingucci.leaderboard;

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
    private Integer rank;
    private Integer totalScore;
    private Integer penalty;
    private Set<Long> solvedProblems = new HashSet<>();
    private Map<Long, Integer> problemAttempts = new HashMap<>();
    private Map<Long, Integer> problemSolveTimes = new HashMap<>();
}
