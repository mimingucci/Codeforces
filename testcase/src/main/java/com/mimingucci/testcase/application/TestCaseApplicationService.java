package com.mimingucci.testcase.application;

import com.mimingucci.testcase.presentation.dto.request.TestCaseCreateBatchRequest;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface TestCaseApplicationService {
    TestCaseResponse getTestCaseById(Long testCaseId, HttpServletRequest request);

    List<TestCaseResponse> getTestCaseByProblemId(Long problemId, HttpServletRequest request);

    TestCaseResponse createTestCase(TestCaseRequest testCase, HttpServletRequest request);

    TestCaseResponse updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request);

    void deleteTestCase(Long testCaseId, HttpServletRequest request);

    List<TestCaseResponse> createBatchTestCases(TestCaseCreateBatchRequest testcases, HttpServletRequest request);
}
