package com.mimingucci.contest.presentation.dto.response;

import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContestantCheckResponse {
    Long contest;

    Instant startTime;

    Instant endTime;

    Long user;

    Boolean rated;

    Boolean participated;

    ContestType type;
}
