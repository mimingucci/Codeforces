package com.mimingucci.ranking.application.assembler;

import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VirtualContestAssembler {
    VirtualContestAssembler INSTANCE = Mappers.getMapper(VirtualContestAssembler.class);

    VirtualContestMetadata toVirtual(VirtualContestRequest request);
}
