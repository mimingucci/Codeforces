package com.mimingucci.testcase.presentation.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCaseRequest {
    String input;
    String output;
    Long problem;
}
