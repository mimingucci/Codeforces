package com.mimingucci.ranking.infrastructure.repository.entity;

import com.mimingucci.ranking.infrastructure.repository.converter.LongIntegerMapConverter;
import com.mimingucci.ranking.infrastructure.repository.converter.LongSetConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "leaderboard_entry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryEntity {
    @Id
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "contest_id", nullable = false)
    private Long contestId;

    @Column(name = "_rank")
    private Integer rank = -1;

    @Column(name = "total_score")
    private Integer totalScore = 0;

    private Integer penalty = 0;

    private Boolean rated = false;

    @Convert(converter = LongSetConverter.class)
    @Column(name = "solved_problems")
    private Set<Long> solvedProblems = new HashSet<>();

    @Convert(converter = LongIntegerMapConverter.class)
    @Column(name = "problem_attempts")
    private Map<Long, Integer> problemAttempts = new HashMap<>();

    @Convert(converter = LongIntegerMapConverter.class)
    @Column(name = "problem_solve_times")
    private Map<Long, Integer> problemSolveTimes = new HashMap<>();
}
