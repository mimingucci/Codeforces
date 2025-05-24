package com.mimingucci.submission.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VirtualContestResponse {
    Long id;

    Long user;

    Long contest;

    Instant startTime;

    Instant endTime;

    Instant actualStartTime;

    Instant actualEndTime;
}
