package com.mimingucci.contest.presentation.dto.request;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.validation.ValidTimeRange;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
@ValidTimeRange(message = ErrorMessageConstants.INVALID_TIME_RANGE)
public class ContestCreateRequest {
    @NotNull
    @NotBlank
    private String name;

    @NotNull
    private Instant startTime;

    @NotNull
    private Instant endTime;

    private Boolean enabled = true;

    private Boolean isPublic = true;

    private ContestType type = ContestType.NORMAL;

    @NotNull
    @NotEmpty
    private Long[] authors = new Long[0];

    private Long[] testers = new Long[0];

    private Long[] coordinators = new Long[0];
}
