package com.mimingucci.testcase.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCaseResponse {
    Long id;
    String input;
    String output;
    Long problem;
}
