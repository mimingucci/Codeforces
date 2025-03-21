package com.mimingucci.problem.application;

import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface ProblemApplicationService {
    ProblemResponse createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest);

    ProblemResponse getProblemById(Long id);

    ProblemResponse updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest);

    PageableResponse<ProblemResponse> getAllProblems(Pageable pageable);

    PageableResponse<ProblemResponse> getAllProblemsByRating(Integer rating, Pageable pageable);
}
