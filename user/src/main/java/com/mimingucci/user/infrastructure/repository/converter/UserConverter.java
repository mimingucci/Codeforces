package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        uses = {CountryConverter.class}
        )
public interface UserConverter {
    @Mapping(source = "country", target = "country")
    UserEntity toEntity(User domain);

    @Mapping(source = "country", target = "country")
    User toDomain(UserEntity entity);
}
