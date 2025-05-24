package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.infrastructure.repository.entity.VirtualContestEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VirtualContestConverter {
    VirtualContestEntity toEntity(VirtualContest domain);

    VirtualContest toDomain(VirtualContestEntity entity);
}
