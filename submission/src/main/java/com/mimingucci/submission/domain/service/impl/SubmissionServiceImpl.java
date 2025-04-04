package com.mimingucci.submission.domain.service.impl;

import com.mimingucci.submission.domain.broker.producer.JudgeSubmissionProducer;
import com.mimingucci.submission.domain.event.JudgeSubmissionEvent;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.repository.SubmissionRepository;
import com.mimingucci.submission.domain.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepository repository;

    private final JudgeSubmissionProducer producer;

    @Override
    public Submission createSubmission(Submission submission) {
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
