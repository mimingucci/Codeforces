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

@Service
@RequiredArgsConstructor
public class ProblemApplicationServiceImpl implements ProblemApplicationService {
    private final ProblemAssembler assembler;

    private final ProblemService service;

    private final JwtUtil jwtUtil;

    @Override
    public ProblemResponse createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest) {
        Problem domain = this.assembler.createToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpServletRequest);
            domain.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return this.assembler.domainToResponse(this.service.createProblem(domain));
    }

    @Override
    public ProblemResponse getProblemById(Long id) {
        return this.assembler.domainToResponse(this.service.findById(id));
    }

    @Override
    public ProblemResponse updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest) {
        Problem domain = this.assembler.updateToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpServletRequest);
            domain.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return this.assembler.domainToResponse(this.service.updateProblem(id, domain));
    }

    @Override
    public PageableResponse<ProblemResponse> getAllProblems(Pageable pageable) {
        return null;
    }

    @Override
    public PageableResponse<ProblemResponse> getAllProblemsByRating(Integer rating, Pageable pageable) {
        return null;
    }
}
