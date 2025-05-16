package com.mimingucci.submission.domain.service;

import com.mimingucci.submission.domain.model.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface SubmissionService {
    Submission createSubmission(Submission submission);

    Submission updateSubmission(Long id, Submission submission);

    void deleteSubmission(Long id);

    Submission findById(Long id);

    Page<Submission> findAllByUserId(Long userId, Pageable pageable);

    List<Submission> getSubmissionGrid(Long userId, Instant startDate, Instant endDate);
}
