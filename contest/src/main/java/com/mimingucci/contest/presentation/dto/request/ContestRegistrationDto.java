package com.mimingucci.contest.presentation.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContestRegistrationDto {
    private Long user;

    private Long contest;

    private Boolean rated;

    private Boolean participated;
}
