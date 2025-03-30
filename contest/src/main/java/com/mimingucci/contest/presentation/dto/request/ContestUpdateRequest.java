package com.mimingucci.contest.presentation.dto.request;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.validation.ValidTimeRange;
import lombok.Data;

import java.time.Instant;

@Data
@ValidTimeRange(message = ErrorMessageConstants.INVALID_TIME_RANGE)
public class ContestUpdateRequest {
    private String name;

    private Instant startTime;

    private Instant endTime;

    private Boolean enabled;

    private Boolean isPublic;

    private ContestType type;

    private Long[] authors = new Long[0];

    private Long[] testers = new Long[0];

    private Long[] coordinators = new Long[0];
}
