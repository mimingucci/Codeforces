package com.mimingucci.submission.domain.repository;

import com.mimingucci.submission.domain.model.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubmissionRepository {
    Submission save(Submission submission);

    Submission findById(Long id);

    void deleteById(Long id);

    Page<Submission> findAllByUserId(Long userId, Pageable pageable);

    Submission update(Long id, Submission submission);
}
