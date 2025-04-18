package com.mimingucci.testcase.application;

import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface TestCaseApplicationService {
    TestCaseResponse getTestCaseById(Long testCaseId);

    List<TestCaseResponse> getTestCaseByProblemId(Long problemId);

    TestCaseResponse createTestCase(TestCaseRequest testCase, HttpServletRequest request);

    TestCaseResponse updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request);

    void deleteTestCase(Long testCaseId, HttpServletRequest request);
}
