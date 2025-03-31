package com.mimingucci.testcase.presentation.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestCaseCreateBatchRequest {
    List<TestCaseRequest> data;

    Long problem;
}
