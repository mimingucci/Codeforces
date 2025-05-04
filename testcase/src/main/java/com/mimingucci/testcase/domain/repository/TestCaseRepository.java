package com.mimingucci.testcase.domain.repository;

import com.mimingucci.testcase.domain.model.TestCase;

import java.util.List;

public interface TestCaseRepository {
    TestCase createTestCase(TestCase testCase);

    List<TestCase> createTestCases(List<TestCase> testCases);

    TestCase getTestCase(Long id);

    List<TestCase> getTestCasesByProblemId(Long problemId);

    void deleteTestCase(Long id);

    TestCase updateTestCase(Long id, TestCase testCase);
}
