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

    @GetMapping(path = PathConstants.PROBLEM + PathConstants.PROBLEM_ID)
    @Override
    public BaseResponse<List<TestCaseResponse>> getTestCaseByProblemId(@PathVariable(name = "problemId") Long problemId, HttpServletRequest request) {
        return BaseResponse.success(applicationService.getTestCaseByProblemId(problemId, request));
    }


    @GetMapping(path = PathConstants.TEST_CASE_ID)
    @Override
    public BaseResponse<TestCaseResponse> getTestCaseById(@PathVariable(name = "testCaseId") Long testCaseId, HttpServletRequest request) {
        return BaseResponse.success(applicationService.getTestCaseById(testCaseId, request));
    }

    @PutMapping(path = PathConstants.TEST_CASE_ID)
    @Override
    public BaseResponse<TestCaseResponse> updateTestCase(@PathVariable(name = "testCaseId") Long testCaseId, @RequestBody @Validated TestCaseRequest testCase, HttpServletRequest request) {
        return BaseResponse.success(applicationService.updateTestCase(testCaseId, testCase, request));
    }

    @DeleteMapping(path = PathConstants.TEST_CASE_ID)
    @Override
    public BaseResponse<?> deleteTestCase(@PathVariable(name = "testCaseId") Long testCaseId, HttpServletRequest request) {
        applicationService.deleteTestCase(testCaseId, request);
        return BaseResponse.success(true);
    }

    @PostMapping
    @Override
    public BaseResponse<TestCaseResponse> createTestCase(@RequestBody @Validated TestCaseRequest testCase, HttpServletRequest request) {
        return BaseResponse.success(applicationService.createTestCase(testCase, request));
    }

}
