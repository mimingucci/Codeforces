package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.ContestInvitation;
import com.mimingucci.contest.infrastructure.repository.entity.ContestInvitationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ContestInvitationConverter {
    ContestInvitationConverter INSTANCE = Mappers.getMapper(ContestInvitationConverter.class);

    ContestInvitationEntity toEntity(ContestInvitation domain);

    ContestInvitation toDomain(ContestInvitationEntity entity);
}
