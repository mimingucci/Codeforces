package com.mimingucci.problem.application.impl;

import com.mimingucci.problem.application.ProblemApplicationService;
import com.mimingucci.problem.application.assembler.ProblemAssembler;
import com.mimingucci.problem.common.constant.ErrorMessageConstants;
import com.mimingucci.problem.common.exception.ApiRequestException;
import com.mimingucci.problem.common.util.JwtUtil;
import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.domain.service.ProblemService;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemApplicationServiceImpl implements ProblemApplicationService {

    private final ProblemService service;

    private final JwtUtil jwtUtil;

    @Override
    public ProblemResponse createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest) {
        Problem domain = ProblemAssembler.INSTANCE.createToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpServletRequest);
            domain.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return ProblemAssembler.INSTANCE.domainToResponse(this.service.createProblem(domain));
    }

    @Override
    public ProblemResponse getProblemById(Long id) {
        return ProblemAssembler.INSTANCE.domainToResponse(this.service.findById(id));
    }

    @Override
    public ProblemResponse updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest) {
        Problem domain = ProblemAssembler.INSTANCE.updateToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpServletRequest);
            domain.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return ProblemAssembler.INSTANCE.domainToResponse(this.service.updateProblem(id, domain));
    }

    @Override
    public PageableResponse<ProblemResponse> getAllProblems(Pageable pageable) {
        return ProblemAssembler.INSTANCE.pageToResponse(this.service.findAll(pageable));
    }

    @Override
    public PageableResponse<ProblemResponse> getAllProblemsByRating(Integer rating, Pageable pageable) {
        return ProblemAssembler.INSTANCE.pageToResponse(this.service.findAllByRating(rating, pageable));
    }

    @Override
    public List<ProblemResponse> getAllProblemsByContestId(Long contestId) {
        return this.service.findAllByContest(contestId).stream().map(ProblemAssembler.INSTANCE::domainToResponse).toList();
    }

    @Override
    public Boolean updateProblemStatus(Long contestId, Boolean status, String token) {
        if (token == null || !token.equals("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")) {
            return false;
        }
        this.service.updateProblemStatus(contestId, status);
        return true;
    }

    @Override
    public ProblemResponse getProblemByIdDev(Long problemId, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return ProblemAssembler.INSTANCE.domainToResponse(this.service.findByIdDev(problemId, userId));
    }

    @Override
    public List<ProblemResponse> getAllProblemsByContestIdDev(Long contestId, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return this.service.findAllByContestDev(contestId, userId).stream().map(ProblemAssembler.INSTANCE::domainToResponse).toList();
    }
}
