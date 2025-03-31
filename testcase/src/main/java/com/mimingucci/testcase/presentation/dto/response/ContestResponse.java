package com.mimingucci.testcase.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
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
}
