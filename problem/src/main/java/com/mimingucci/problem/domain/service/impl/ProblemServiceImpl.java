package com.mimingucci.problem.domain.service.impl;

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

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRepository repository;

    private final ContestClient contestClient;

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
}
