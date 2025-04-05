package com.mimingucci.problem.infrastructure.repository.converter;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.infrastructure.repository.entity.ProblemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProblemConverter {
    ProblemConverter INSTANCE = Mappers.getMapper(ProblemConverter.class);

    Problem toDomain(ProblemEntity entity);

    ProblemEntity toEntity(Problem domain);
}
