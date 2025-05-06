package com.mimingucci.ranking.domain.client.response;

import com.mimingucci.ranking.common.enums.ContestType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContestResponse {
    Long id;
    String name;
    Instant startTime;
    Instant endTime;
    Set<Long> authors;
    Set<Long> testers;
    Set<Long> coordinators;
    Boolean enabled;
    Boolean isPublic;
    ContestType type;
    Long createdBy;
}
