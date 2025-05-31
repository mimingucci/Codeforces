package com.mimingucci.submission.domain.repository;

import com.mimingucci.submission.domain.model.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface SubmissionRepository {
    Submission save(Submission submission);

    Submission findById(Long id);

    void deleteById(Long id);

    Page<Submission> findAllByUserId(Long userId, Pageable pageable);

    Submission update(Long id, Submission submission);

    List<Submission> getSubmissionGrid(Long userId, Instant startDate, Instant endDate);

    List<Submission> findAcceptedSubmissionsByContest(Long contestId, Instant startDate, Instant endDate);
}
