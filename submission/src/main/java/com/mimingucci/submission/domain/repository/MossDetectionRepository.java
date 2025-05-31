package com.mimingucci.submission.domain.repository;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.domain.model.MossDetection;

import java.util.List;
import java.util.Optional;

public interface MossDetectionRepository {
    MossDetection save(MossDetection domain);
    List<MossDetection> getAllByContest(Long contestId);
    MossDetection getByContestAndLanguage(Long contestId, SubmissionLanguage language);
    Optional<MossDetection> findById(Long id);
}
