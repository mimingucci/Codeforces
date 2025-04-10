package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualLeaderboardUpdateSerializable {
    private Long contestId;

    private Long userId;

    private String data;
}
