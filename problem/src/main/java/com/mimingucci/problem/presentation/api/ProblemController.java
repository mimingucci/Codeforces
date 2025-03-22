package com.mimingucci.problem.presentation.api;

import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.BaseResponse;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface ProblemController {
    BaseResponse<ProblemResponse> getProblemById(Long id);

    BaseResponse<ProblemResponse> createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<ProblemResponse> updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<PageableResponse<ProblemResponse>> getAllProblems(Integer rating, Pageable pageable);
}
