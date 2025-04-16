package com.mimingucci.submission.domain.service.impl;

import com.mimingucci.submission.common.constant.ErrorMessageConstants;
import com.mimingucci.submission.common.exception.ApiRequestException;
import com.mimingucci.submission.domain.broker.producer.JudgeSubmissionProducer;
import com.mimingucci.submission.domain.client.ContestClient;
import com.mimingucci.submission.domain.client.ProblemClient;
import com.mimingucci.submission.domain.client.response.ProblemResponse;
import com.mimingucci.submission.domain.event.JudgeSubmissionEvent;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.repository.SubmissionRepository;
import com.mimingucci.submission.domain.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepository repository;

    private final JudgeSubmissionProducer producer;

    private final ContestClient contestClient;

    private final ProblemClient problemClient;

    @Override
    public Submission createSubmission(Submission submission) {
        if (!contestClient.getContestById(submission.getAuthor(), submission.getContest()).data()) throw new ApiRequestException(ErrorMessageConstants.CAN_NOT_SUBMIT, HttpStatus.BAD_REQUEST);
        ProblemResponse problemResponse = problemClient.getProblemById(submission.getProblem()).data();
        if (problemResponse == null) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!Objects.equals(problemResponse.getContest(), submission.getContest())) throw new ApiRequestException(ErrorMessageConstants.CONFLICT_DATA, HttpStatus.CONFLICT);
        Submission domain = repository.save(submission);
        producer.sendSubmissionToJudge(new JudgeSubmissionEvent(domain.getId(), domain.getProblem(), domain.getSourceCode()));
        return domain;
    }

    @Override
    public Submission updateSubmission(Long id, Submission submission) {
        return repository.update(id, submission);
    }

    @Override
    public void deleteSubmission(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Submission findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Page<Submission> findAllByUserId(Long userId, Pageable pageable) {
        return repository.findAllByUserId(userId, pageable);
    }
}
