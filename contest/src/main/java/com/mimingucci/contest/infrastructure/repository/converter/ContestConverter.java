package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContestConverter {
    ContestConverter INSTANCE = Mappers.getMapper(ContestConverter.class);

    ContestEntity toEntity(Contest contest);

    Contest toDomain(ContestEntity entity);
}
