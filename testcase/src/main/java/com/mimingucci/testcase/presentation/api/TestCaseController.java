package com.mimingucci.testcase.presentation.api;

import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.BaseResponse;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface TestCaseController {
    BaseResponse<TestCaseResponse> getTestCaseById(Long testCaseId, HttpServletRequest request);

    BaseResponse<List<TestCaseResponse>> getTestCaseByProblemId(Long problemId, HttpServletRequest request);

    BaseResponse<TestCaseResponse> createTestCase(TestCaseRequest testCase, HttpServletRequest request);

    BaseResponse<TestCaseResponse> updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request);

    BaseResponse<?> deleteTestCase(Long testCaseId, HttpServletRequest request);
}
