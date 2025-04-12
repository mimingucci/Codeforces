package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.State;
import com.mimingucci.user.infrastructure.repository.entity.StateEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface StateConverter {
    StateConverter INSTANCE = Mappers.getMapper(StateConverter.class);

    State toDomain(StateEntity entity);

    StateEntity toEntity(State domain);
}
