package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper
public interface ContestConverter {
    ContestConverter INSTANCE = Mappers.getMapper(ContestConverter.class);

    ContestEntity toEntity(Contest contest);

    Contest toDomain(ContestEntity entity);

    Page<Contest> listToDomain(Page<ContestEntity> entities);
}
