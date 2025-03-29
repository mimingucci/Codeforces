package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ContestRegistrationIdConverter {
    ContestRegistrationIdConverter INSTANCE = Mappers.getMapper(ContestRegistrationIdConverter.class);

    ContestRegistrationId toEntity(com.mimingucci.contest.domain.model.ContestRegistrationId domain);

    com.mimingucci.contest.domain.model.ContestRegistrationId toDomain(ContestRegistrationId entity);
}
