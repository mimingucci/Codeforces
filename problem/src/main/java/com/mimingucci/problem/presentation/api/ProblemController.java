package com.mimingucci.problem.presentation.api;

import com.mimingucci.problem.common.constant.ValidProblemRating;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.BaseResponse;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ProblemController {
    BaseResponse<ProblemResponse> getProblemById(Long id);

    BaseResponse<ProblemResponse> createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<ProblemResponse> updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<PageableResponse<ProblemResponse>> getAllProblems(@RequestParam(name = "rating", required = false) @ValidProblemRating Integer rating, Pageable pageable);

    BaseResponse<List<ProblemResponse>> getAllProblemsByContestId(Long contestId);

    BaseResponse<Boolean> updateProblemStatus(Long contestId, ProblemUpdateRequest request, HttpServletRequest servletRequest);

    BaseResponse<ProblemResponse> getProblemByIdDev(Long id, HttpServletRequest request);

    BaseResponse<List<ProblemResponse>> getAllProblemsByContestIdDev(Long contestId, HttpServletRequest request);

}
