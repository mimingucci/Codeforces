package com.mimingucci.submission.domain.service;

import com.mimingucci.submission.domain.model.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubmissionService {
    Submission createSubmission(Submission submission);

    Submission updateSubmission(Long id, Submission submission);

    void deleteSubmission(Long id);

    Submission findById(Long id);

    Page<Submission> findAllByUserId(Long userId, Pageable pageable);
}
