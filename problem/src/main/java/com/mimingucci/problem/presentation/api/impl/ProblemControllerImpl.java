package com.mimingucci.problem.presentation.api.impl;

import com.mimingucci.problem.application.ProblemApplicationService;
import com.mimingucci.problem.common.constant.ErrorMessageConstants;
import com.mimingucci.problem.common.constant.PathConstants;
import com.mimingucci.problem.common.constant.ValidProblemRating;
import com.mimingucci.problem.common.exception.ApiRequestException;
import com.mimingucci.problem.presentation.api.ProblemController;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.BaseResponse;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = PathConstants.API_V1_PROBLEM)
@RequiredArgsConstructor
public class ProblemControllerImpl implements ProblemController {
    private final ProblemApplicationService problemApplicationService;

    @GetMapping(path = PathConstants.DEV + PathConstants.CONTEST + PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<List<ProblemResponse>> getAllProblemsByContestIdDev(@PathVariable(name = "contestId") Long contestId, HttpServletRequest request) {
        return BaseResponse.success(this.problemApplicationService.getAllProblemsByContestIdDev(contestId, request));
    }

    @GetMapping(path = PathConstants.DEV + PathConstants.PROBLEM_ID)
    @Override
    public BaseResponse<ProblemResponse> getProblemByIdDev(@PathVariable(name = "problemId") Long problemId, HttpServletRequest request) {
        return BaseResponse.success(this.problemApplicationService.getProblemByIdDev(problemId, request));
    }

    @PostMapping(path = PathConstants.UPLOAD)
    @Override
    public BaseResponse<String> uploadImage(@RequestParam("image") MultipartFile file, HttpServletRequest request) {
        return BaseResponse.success(this.problemApplicationService.uploadImage(file, request));
    }

    @GetMapping(path = PathConstants.ALL)
    @Override
    public BaseResponse<PageableResponse<ProblemResponse>> getAllProblems(@RequestParam(name = "rating", required = false) @ValidProblemRating Integer rating, Pageable pageable) {
        if (rating == null) return BaseResponse.success(this.problemApplicationService.getAllProblems(pageable));
        return BaseResponse.success(this.problemApplicationService.getAllProblemsByRating(rating, pageable));
    }

    @GetMapping(path = PathConstants.CONTEST + PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<List<ProblemResponse>> getAllProblemsByContestId(@PathVariable(name = "contestId") Long contestId) {
        return BaseResponse.success(this.problemApplicationService.getAllProblemsByContestId(contestId));
    }

    @PutMapping(path = PathConstants.CONTEST + PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<Boolean> updateProblemStatus(@PathVariable(name = "contestId") Long contestId, @RequestBody @Validated ProblemUpdateRequest request, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization");
        if (token == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        return BaseResponse.success(this.problemApplicationService.updateProblemStatus(contestId, request.getIsPublished(), token));
    }

    @GetMapping(path = PathConstants.PROBLEM_ID)
    @Override
    public BaseResponse<ProblemResponse> getProblemById(@PathVariable(name = "problemId") Long problemId, HttpServletRequest request) {
        return BaseResponse.success(this.problemApplicationService.getProblemById(problemId, request));
    }

    @PutMapping(path = PathConstants.PROBLEM_ID)
    @Override
    public BaseResponse<ProblemResponse> updateProblem(@PathVariable(name = "problemId") Long id, @RequestBody @Validated ProblemUpdateRequest request, HttpServletRequest httpServletRequest) {
        return BaseResponse.success(this.problemApplicationService.updateProblem(id, request, httpServletRequest));
    }

    @PostMapping
    @Override
    public BaseResponse<ProblemResponse> createProblem(@RequestBody @Validated ProblemCreateRequest request, HttpServletRequest httpServletRequest) {
        return BaseResponse.success(this.problemApplicationService.createProblem(request, httpServletRequest));
    }
}
