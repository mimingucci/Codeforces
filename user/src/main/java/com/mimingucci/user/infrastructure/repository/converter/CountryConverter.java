package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.Country;
import com.mimingucci.user.infrastructure.repository.entity.CountryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface CountryConverter {
    Country toDomain(CountryEntity entity);

    CountryEntity toEntity(Country country);
}
