package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualLeaderboardUpdateSerializable {
    private Long id;

    private String data;
}
