package com.mimingucci.submission.infrastructure.repository.jpa;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.infrastructure.repository.entity.MossDetectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MossDetectionJpaRepository extends JpaRepository<MossDetectionEntity, Long> {
    boolean existsByContestIdAndStatus(Long contestId, String status);
    Optional<MossDetectionEntity> findByContestIdAndStatus(Long contestId, String status);
    List<MossDetectionEntity> findAllByContestIdAndStatus(Long contestId, String status);
    Optional<MossDetectionEntity> findByContestIdAndLanguageAndStatus(Long contestId, SubmissionLanguage language, String status);
    List<MossDetectionEntity> findAllByContestIdAndLanguageAndStatus(Long contestId, SubmissionLanguage language, String status);
}
