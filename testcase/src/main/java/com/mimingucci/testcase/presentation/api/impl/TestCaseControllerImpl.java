package com.mimingucci.testcase.presentation.api.impl;

import com.mimingucci.testcase.application.TestCaseApplicationService;
import com.mimingucci.testcase.common.constant.PathConstants;
import com.mimingucci.testcase.presentation.api.TestCaseController;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.BaseResponse;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = PathConstants.API_V1_TEST_CASE)
@RequiredArgsConstructor
public class TestCaseControllerImpl implements TestCaseController {
    private final TestCaseApplicationService applicationService;

    @GetMapping(path = PathConstants.TEST_CASE_ID)
    @Override
    public BaseResponse<TestCaseResponse> getTestCaseById(@PathVariable(name = "testCaseId") Long testCaseId) {
        return BaseResponse.success(applicationService.getTestCaseById(testCaseId));
    }

    @GetMapping(path = PathConstants.PROBLEM + PathConstants.PROBLEM_ID)
    @Override
    public BaseResponse<List<TestCaseResponse>> getTestCaseByProblemId(@PathVariable(name = "problemId") Long problemId) {
        return BaseResponse.success(applicationService.getTestCaseByProblemId(problemId));
    }

    @PostMapping
    @Override
    public BaseResponse<TestCaseResponse> createTestCase(@RequestBody @Validated TestCaseRequest testCase, HttpServletRequest request) {
        return BaseResponse.success(applicationService.createTestCase(testCase, request));
    }

    @Override
    public BaseResponse<TestCaseResponse> updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request) {
        return BaseResponse.success(applicationService.updateTestCase(testCaseId, testCase, request));
    }

    @Override
    public BaseResponse<?> deleteTestCase(Long testCaseId, HttpServletRequest request) {
        applicationService.deleteTestCase(testCaseId, request);
        return BaseResponse.success();
    }
}
