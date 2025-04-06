package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.infrastructure.repository.entity.SubmissionResultEntity;
import com.mimingucci.ranking.infrastructure.util.IdGenerator;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SubmissionResultConverter {
    SubmissionResultConverter INSTANCE = Mappers.getMapper(SubmissionResultConverter.class);

    SubmissionResultEntity eventToEntity(SubmissionResultEvent event);

    default SubmissionResultEntity toEntity(SubmissionResultEvent event) {
        SubmissionResultEntity entity = this.eventToEntity(event);
        entity.setId(IdGenerator.INSTANCE.nextId());
        return entity;
    }
}
