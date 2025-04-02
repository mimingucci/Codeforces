package com.mimingucci.contest.presentation.dto.response;

import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContestResponse {
    String name;
    Instant startTime;
    Instant endTime;
    Set<Long> authors;
    Set<Long> testers;
    Set<Long> coordinators;
    Boolean enabled;
    Boolean isPublic;
    ContestType type;
}
