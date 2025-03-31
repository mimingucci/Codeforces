package com.mimingucci.testcase.application.impl;

import com.mimingucci.testcase.application.TestCaseApplicationService;
import com.mimingucci.testcase.application.assembler.TestCaseAssembler;
import com.mimingucci.testcase.common.constant.ErrorMessageConstants;
import com.mimingucci.testcase.common.exception.ApiRequestException;
import com.mimingucci.testcase.common.util.JwtUtil;
import com.mimingucci.testcase.domain.service.TestCaseService;
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
    private final TestCaseAssembler assembler;

    private final JwtUtil jwtUtil;

    private final TestCaseService service;

    @Override
    public TestCaseResponse getTestCaseById(Long testCaseId) {
        return this.assembler.toResponse(service.getTestCase(testCaseId));
    }

    @Override
    public List<TestCaseResponse> getTestCaseByProblemId(Long problemId) {
        return service.getTestCasesByProblemId(problemId).stream().map(this.assembler::toResponse).toList();
    }

    @Override
    public TestCaseResponse createTestCase(TestCaseRequest testCase, HttpServletRequest request) {
        Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
        try {
            Long author = claims.get("id", Long.class);
            return this.assembler.toResponse(service.createTestCase(author, this.assembler.toDomain(testCase)));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public TestCaseResponse updateTestCase(Long testCaseId, TestCaseRequest testCase, HttpServletRequest request) {
        Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
        try {
            Long author = claims.get("id", Long.class);
            return this.assembler.toResponse(service.updateTestCase(author, testCaseId, this.assembler.toDomain(testCase)));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void deleteTestCase(Long testCaseId, HttpServletRequest request) {
        Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
        try {
            Long author = claims.get("id", Long.class);
            service.deleteTestCase(author, testCaseId);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }
}
