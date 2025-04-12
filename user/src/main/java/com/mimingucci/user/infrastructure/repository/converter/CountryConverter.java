package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.Country;
import com.mimingucci.user.infrastructure.repository.entity.CountryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE,
        uses = {StateConverter.class})
public interface CountryConverter {
    CountryConverter INSTANCE = Mappers.getMapper(CountryConverter.class);

    @Mapping(source = "states", target = "states")
    Country toDomain(CountryEntity entity);

    @Mapping(source = "states", target = "states")
    CountryEntity toEntity(Country country);
}
