package com.mimingucci.problem.domain.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mimingucci.problem.common.constant.ErrorMessageConstants;
import com.mimingucci.problem.common.exception.ApiRequestException;
import com.mimingucci.problem.domain.client.ContestClient;
import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.domain.repository.ProblemRepository;
import com.mimingucci.problem.domain.service.ProblemService;
import com.mimingucci.problem.presentation.dto.response.BaseResponse;
import com.mimingucci.problem.presentation.dto.response.ContestResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRepository repository;

    private final ContestClient contestClient;

    private final Cloudinary cloudinary;

    @Override
    public Problem createProblem(Problem domain) {
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(domain.getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE)) throw new ApiRequestException(ErrorMessageConstants.INTERNAL_SERVER, HttpStatus.CONFLICT);
        if (contest.data().getStartTime().isBefore(Instant.now()) || !contest.data().getAuthors().contains(domain.getAuthor())) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        return this.repository.createProblem(domain);
    }

    @Override
    public Problem findById(Long id) {
        return this.repository.findById(id);
    }

    @Override
    public Problem updateProblem(Long id, Problem domain) {
        return this.repository.updateProblem(id, domain);
    }

    @Override
    public Problem getById(Long id) {
        return this.repository.findByIdDev(id);
    }

    @Override
    public Page<Problem> findAll(Pageable pageable) {
        return this.repository.findProblems(pageable);
    }

    @Override
    public Page<Problem> findAllByRating(Integer rating, Pageable pageable) {
        return this.repository.findProblemsByRating(rating, pageable);
    }

    @Override
    public List<Problem> findAllByContest(Long contest) {
        return this.repository.findAllProblemsByContest(contest);
    }

    @Override
    public void updateProblemStatus(Long contestId, Boolean status) {
        this.repository.updateProblemStatus(contestId, status);
    }

    @Override
    public Problem findByIdDev(Long problemId, Long userId) {
        Problem problem = this.repository.findByIdDev(problemId);
        try {
            BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.getContest());
            if (contest.data().getAuthors().contains(userId) || contest.data().getCoordinators().contains(userId) || contest.data().getTesters().contains(userId) || contest.data().getStartTime().isBefore(Instant.now())) {
                return problem;
            } else {
                throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public List<Problem> findAllByContestDev(Long contestId, Long userId) {
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(contestId);
        if (contest.data().getAuthors().contains(userId) || contest.data().getCoordinators().contains(userId) || contest.data().getTesters().contains(userId) || contest.data().getStartTime().isBefore(Instant.now())) {
            return this.repository.findAllProblemsByContestDev(contestId);
        } else {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new ApiRequestException(ErrorMessageConstants.UPLOAD_IMAGE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
