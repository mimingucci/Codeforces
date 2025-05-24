package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContestRegistrationConverter {
    ContestRegistrationConverter INSTANCE = Mappers.getMapper(ContestRegistrationConverter.class);

    ContestRegistrationEntity toEntity(ContestRegistration domain);

    ContestRegistration toDomain(ContestRegistrationEntity entity);
}
