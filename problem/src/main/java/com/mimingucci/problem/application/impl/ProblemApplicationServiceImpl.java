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
import java.util.Objects;

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
        if (token == null) {
            return false;
        }
        try {
            Claims claims = this.jwtUtil.validateToken(token);
            String password = claims.getSubject();
            if (!Objects.equals(password, "SYSTEM")) return false;
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
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
