package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardUpdate {
    private Long contestId;
    private List<LeaderboardEntry> entries;
}
