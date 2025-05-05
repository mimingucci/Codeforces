package com.mimingucci.testcase.domain.service.impl;

import com.mimingucci.testcase.common.constant.ErrorMessageConstants;
import com.mimingucci.testcase.common.exception.ApiRequestException;
import com.mimingucci.testcase.domain.client.ContestClient;
import com.mimingucci.testcase.domain.client.ProblemClient;
import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.domain.repository.TestCaseRepository;
import com.mimingucci.testcase.domain.service.TestCaseService;
import com.mimingucci.testcase.presentation.dto.request.TestCaseCreateBatchRequest;
import com.mimingucci.testcase.presentation.dto.response.BaseResponse;
import com.mimingucci.testcase.presentation.dto.response.ContestResponse;
import com.mimingucci.testcase.presentation.dto.response.ProblemResponse;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {
    private final TestCaseRepository repository;

    private final ProblemClient problemClient;

    private final ContestClient contestClient;

    @Override
    public TestCase createTestCase(Long author, TestCase testCase) {
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testCase.getProblem());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        return repository.createTestCase(testCase);
    }

    @Override
    public TestCase getTestCase(Long id, Long author) {
        TestCase domain = repository.getTestCase(id);
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(domain.getProblem());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        return domain;
    }

    @Override
    public List<TestCase> getTestCasesByProblemId(Long problemId) {
        return repository.getTestCasesByProblemId(problemId);
    }

    @Override
    public void deleteTestCase(Long author, Long id) {
        TestCase testCase = repository.getTestCase(id);
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testCase.getProblem());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) throw  new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        repository.deleteTestCase(id);
    }

    @Override
    public TestCase updateTestCase(Long author, Long id, TestCase testCase) {
        TestCase testcase = repository.getTestCase(id);
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(testcase.getProblem());
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        return repository.updateTestCase(id, testCase);
    }

    @Override
    public List<TestCase> getTestCasesByProblemIdTester(Long problemId, Long author) {
        BaseResponse<ProblemResponse> problem = this.problemClient.getProblemById(problemId);
        if (!problem.code().equals(BaseResponse.SUCCESS_CODE) || problem.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problem.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        return repository.getTestCasesByProblemId(problemId);
    }

    @Override
    public List<TestCase> createTestCases(List<TestCase> testcases, Long problem, Long author) {
        BaseResponse<ProblemResponse> problems = this.problemClient.getProblemById(problem);
        if (!problems.code().equals(BaseResponse.SUCCESS_CODE) || problems.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problems.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        return repository.createTestCases(testcases);
    }

    @Override
    public Boolean deleteTestCaseByProblemId(Long author, Long problemId) {
        BaseResponse<ProblemResponse> problems = this.problemClient.getProblemById(problemId);
        if (!problems.code().equals(BaseResponse.SUCCESS_CODE) || problems.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        BaseResponse<ContestResponse> contest = this.contestClient.getContestById(problems.data().getContest());
        if (!contest.code().equals(BaseResponse.SUCCESS_CODE) || contest.data() == null) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (!contest.data().getTesters().contains(author) && !contest.data().getAuthors().contains(author)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        repository.deleteTestCasesByProblemId(problemId);
        return true;
    }
}
