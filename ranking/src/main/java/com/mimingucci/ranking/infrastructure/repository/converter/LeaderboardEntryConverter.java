package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.infrastructure.repository.entity.LeaderboardEntryEntity;
import com.mimingucci.ranking.infrastructure.util.IdGenerator;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeaderboardEntryConverter {
    LeaderboardEntryConverter INSTANCE = Mappers.getMapper(LeaderboardEntryConverter.class);

    LeaderboardEntryEntity entryToEntity(LeaderboardEntry entry);

    default LeaderboardEntryEntity toEntity(LeaderboardEntry event) {
        LeaderboardEntryEntity entity = this.entryToEntity(event);
        entity.setId(IdGenerator.INSTANCE.nextId());
        return entity;
    }
}
