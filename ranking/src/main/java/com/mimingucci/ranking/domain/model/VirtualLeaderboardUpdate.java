package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualLeaderboardUpdate {
    private Long contestId;

    private Long userId;

    private List<LeaderboardEntry> entries;
}
