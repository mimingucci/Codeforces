package com.mimingucci.problem.application;

import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProblemApplicationService {
    ProblemResponse createProblem(ProblemCreateRequest request, HttpServletRequest httpServletRequest);

    ProblemResponse getProblemById(Long id, HttpServletRequest request);

    ProblemResponse updateProblem(Long id, ProblemUpdateRequest request, HttpServletRequest httpServletRequest);

    PageableResponse<ProblemResponse> getAllProblems(Pageable pageable);

    PageableResponse<ProblemResponse> getAllProblemsByRating(Integer rating, Pageable pageable);

    List<ProblemResponse> getAllProblemsByContestId(Long contestId);

    Boolean updateProblemStatus(Long contestId, Boolean status, String token);

    ProblemResponse getProblemByIdDev(Long problemId, HttpServletRequest request);

    List<ProblemResponse> getAllProblemsByContestIdDev(Long contestId, HttpServletRequest request);

    String uploadImage(MultipartFile file, HttpServletRequest request);
}
