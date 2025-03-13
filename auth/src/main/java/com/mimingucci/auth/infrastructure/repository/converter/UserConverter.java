package com.mimingucci.auth.infrastructure.repository.converter;

import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserConverter {
    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);

    UserEntity toEntity(User domain);

    User toDomain(UserEntity entity);
}
