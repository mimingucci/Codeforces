package com.mimingucci.ranking.infrastructure.repository.jpa;

import com.mimingucci.ranking.infrastructure.repository.entity.SubmissionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionResultJpaRepository extends JpaRepository<SubmissionResultEntity, Long> {
    List<SubmissionResultEntity> findByContest(Long contest);
}
