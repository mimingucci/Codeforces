package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestMetadata implements Serializable {
    private Long id;

    private Instant startTime;

    private Instant endTime;
}
