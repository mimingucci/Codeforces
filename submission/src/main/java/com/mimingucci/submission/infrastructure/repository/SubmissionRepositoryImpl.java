package com.mimingucci.submission.infrastructure.repository;

import com.mimingucci.submission.common.constant.ErrorMessageConstants;
import com.mimingucci.submission.common.enums.SubmissionVerdict;
import com.mimingucci.submission.common.exception.ApiRequestException;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.repository.SubmissionRepository;
import com.mimingucci.submission.infrastructure.repository.converter.SubmissionConverter;
import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import com.mimingucci.submission.infrastructure.repository.jpa.SubmissionJpaRepository;
import com.mimingucci.submission.infrastructure.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
@RequiredArgsConstructor
public class SubmissionRepositoryImpl implements SubmissionRepository {
    private final SubmissionJpaRepository jpaRepository;

    @Override
    public Submission save(Submission submission) {
        SubmissionEntity entity = SubmissionConverter.INSTANCE.toEntity(submission);
        entity.setId(IdGenerator.INSTANCE.nextId());
        entity.setSent(Instant.now());
        entity.setVerdict(SubmissionVerdict.IN_QUEUE);
        return SubmissionConverter.INSTANCE.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Submission findById(Long id) {
        SubmissionEntity entity = jpaRepository.findById(id).orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.SUBMISSION_NOT_FOUND, HttpStatus.NOT_FOUND));
        return SubmissionConverter.INSTANCE.toDomain(entity);
    }

    @Override
    public void deleteById(Long id) {

    }

    @Override
    public Page<Submission> findAllByUserId(Long userId, Pageable pageable) {
        Page<SubmissionEntity> page = jpaRepository.findByAuthor(userId, pageable);
        return page.map(SubmissionConverter.INSTANCE::toDomain);
    }

    @Override
    public Submission update(Long id, Submission submission) {
        SubmissionEntity entity = jpaRepository.findById(id).orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.SUBMISSION_NOT_FOUND, HttpStatus.NOT_FOUND));
        if (submission.getVerdict() != null && entity.getVerdict() == null) {
            entity.setJudged(Instant.now());
            entity.setVerdict(submission.getVerdict());
        }
        if (submission.getExecution_time_ms() != null) entity.setExecution_time_ms(submission.getExecution_time_ms());
        if (submission.getMemory_used_bytes() != null) entity.setMemory_used_bytes(submission.getMemory_used_bytes());
        return SubmissionConverter.INSTANCE.toDomain(jpaRepository.save(entity));
    }
}
