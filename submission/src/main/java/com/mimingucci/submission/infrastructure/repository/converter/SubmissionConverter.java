package com.mimingucci.submission.infrastructure.repository.converter;

import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import org.mapstruct.Mapper;

@Mapper
public interface SubmissionConverter {
    Submission toDomain(SubmissionEntity entity);

    SubmissionEntity toEntity(Submission submission);
}
