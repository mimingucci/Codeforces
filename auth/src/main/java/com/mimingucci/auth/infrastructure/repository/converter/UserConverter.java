package com.mimingucci.auth.infrastructure.repository.converter;

import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserConverter {
    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);

    UserEntity toEntity(User domain);

    User toDomain(UserEntity entity);
}
