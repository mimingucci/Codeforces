package com.mimingucci.submission.infrastructure.repository.converter;

import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SubmissionConverter {
    SubmissionConverter INSTANCE = Mappers.getMapper( SubmissionConverter.class );

    Submission toDomain(SubmissionEntity entity);

    SubmissionEntity toEntity(Submission submission);
}
