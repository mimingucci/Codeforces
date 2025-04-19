package com.mimingucci.testcase.domain.service.impl;

import com.mimingucci.testcase.common.constant.ErrorMessageConstants;
import com.mimingucci.testcase.common.exception.ApiRequestException;
import com.mimingucci.testcase.domain.client.ContestClient;
import com.mimingucci.testcase.domain.client.ProblemClient;
import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.domain.repository.TestCaseRepository;
import com.mimingucci.testcase.domain.service.TestCaseService;
import com.mimingucci.testcase.presentation.dto.response.BaseResponse;
import com.mimingucci.testcase.presentation.dto.response.ContestResponse;
import com.mimingucci.testcase.presentation.dto.response.ProblemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {
    private final TestCaseRepository repository;

    private final ProblemClient problemClient;

    private final ContestClient contestClient;

    @Override
    public TestCase createTestCase(Long author, TestCase testCase) {
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testCase.getId());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        return repository.createTestCase(testCase);
    }

    @Override
    public TestCase getTestCase(Long id) {
        return repository.getTestCase(id);
    }

    @Override
    public List<TestCase> getTestCasesByProblemId(Long problemId) {
        return repository.getTestCasesByProblemId(problemId);
    }

    @Override
    public void deleteTestCase(Long author, Long id) {
        TestCase testCase = repository.getTestCase(id);
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testCase.getId());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) throw  new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        repository.deleteTestCase(id);
    }

    @Override
    public TestCase updateTestCase(Long author, Long id, TestCase testCase) {
        TestCase testcase = repository.getTestCase(id);
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testcase.getId());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) throw  new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        return repository.updateTestCase(id, testCase);
    }
}
