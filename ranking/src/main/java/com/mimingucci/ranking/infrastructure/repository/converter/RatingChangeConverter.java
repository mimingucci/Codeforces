package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RatingChangeConverter {
    RatingChange toDomain(RatingChangeEntity entity);

    RatingChangeEntity toEntity(RatingChange domain);
}
