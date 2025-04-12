package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        uses = {
            CountryConverter.class,
            StateConverter.class
        })
public interface UserConverter {
    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);

    @Mapping(source = "country", target = "country")
    @Mapping(source = "state", target = "state")
    UserEntity toEntity(User domain);

    @Mapping(source = "country", target = "country")
    @Mapping(source = "state", target = "state")
    User toDomain(UserEntity entity);
}
