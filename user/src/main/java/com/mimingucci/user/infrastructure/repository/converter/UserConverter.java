package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE
        )
public interface UserConverter {
    UserEntity toEntity(User domain);

    User toDomain(UserEntity entity);
}
