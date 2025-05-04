package com.mimingucci.testcase.domain.service;

import com.mimingucci.testcase.domain.model.TestCase;

import java.util.List;

public interface TestCaseService {
    TestCase createTestCase(Long author, TestCase testCase);

    TestCase getTestCase(Long id, Long author);

    List<TestCase> getTestCasesByProblemId(Long problemId);

    void deleteTestCase(Long author, Long id);

    TestCase updateTestCase(Long author, Long id, TestCase testCase);

    List<TestCase> getTestCasesByProblemIdTester(Long problemId, Long author);

    List<TestCase> createTestCases(List<TestCase> testcases, Long problem, Long author);
}
