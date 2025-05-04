package com.mimingucci.testcase.application.impl;

import com.mimingucci.testcase.application.TestCaseApplicationService;
import com.mimingucci.testcase.application.assembler.TestCaseAssembler;
import com.mimingucci.testcase.common.constant.ErrorMessageConstants;
import com.mimingucci.testcase.common.exception.ApiRequestException;
import com.mimingucci.testcase.common.util.JwtUtil;
import com.mimingucci.testcase.domain.service.TestCaseService;
import com.mimingucci.testcase.presentation.dto.request.TestCaseCreateBatchRequest;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestCaseApplicationServiceImpl implements TestCaseApplicationService {

    private final JwtUtil jwtUtil;

    private final TestCaseService service;

    @Override
    public TestCaseResponse getTestCaseById(Long testCaseId, HttpServletRequest request) {
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return TestCaseAssembler.INSTANCE.toResponse(service.getTestCase(testCaseId, author));
    }

    @Override
    public List<TestCaseResponse> getTestCaseByProblemId(Long problemId, HttpServletRequest request) {
        if (request.getHeader("X-Judger-Secret") != null && request.getHeader("X-Judger-Secret").equals("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")) {
            return service.getTestCasesByProblemId(problemId).stream().map(TestCaseAssembler.INSTANCE::toResponse).toList();
        }
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return service.getTestCasesByProblemIdTester(problemId, author).stream().map(TestCaseAssembler.INSTANCE::toResponse).toList();
    }

    @Override
    public TestCaseResponse createTestCase(TestCaseRequest testCase, HttpServletRequest request) {
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return TestCaseAssembler.INSTANCE.toResponse(service.createTestCase(author, TestCaseAssembler.INSTANCE.toDomain(testCase)));
    }

    @Override
    public TestCaseResponse updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request) {
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return TestCaseAssembler.INSTANCE.toResponse(service.updateTestCase(author, testCaseId, TestCaseAssembler.INSTANCE.toDomain(testCase)));
    }

    @Override
    public void deleteTestCase(Long testCaseId, HttpServletRequest request) {
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        service.deleteTestCase(author, testCaseId);
    }

    @Override
    public List<TestCaseResponse> createBatchTestCases(TestCaseCreateBatchRequest testcases, HttpServletRequest request) {
        Long author = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            author = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }

        List<TestCaseRequest> tc = testcases.getData();
        for (var i : tc) i.setProblem(testcases.getProblem());
        return service.createTestCases(tc.stream().map(TestCaseAssembler.INSTANCE::toDomain).toList(), testcases.getProblem(), author).stream().map(TestCaseAssembler.INSTANCE::toResponse).toList();
    }
}
