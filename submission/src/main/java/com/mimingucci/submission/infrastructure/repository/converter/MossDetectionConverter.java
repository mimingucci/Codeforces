package com.mimingucci.submission.infrastructure.repository.converter;

import com.mimingucci.submission.domain.model.MossDetection;
import com.mimingucci.submission.infrastructure.repository.entity.MossDetectionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MossDetectionConverter {
    MossDetectionEntity toEntity(MossDetection domain);

    MossDetection toDomain(MossDetectionEntity entity);
}
