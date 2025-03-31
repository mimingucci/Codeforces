package com.mimingucci.testcase.domain.model;

import lombok.Data;

@Data
public class TestCase {
    private Long id;

    private String input;

    private String output;

    private Long problem;
}
