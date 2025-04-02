package com.mimingucci.user.application.assembler;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserAssembler {
    UserAssembler INSTANCE = org.mapstruct.factory.Mappers.getMapper(UserAssembler.class);

    public abstract User regToDomain(UserUpdateRequest request);

    public abstract UserEntity toEntity(User domain);
}

