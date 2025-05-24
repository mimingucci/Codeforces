package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.contest.presentation.dto.response.VirtualContestResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VirtualContestAssembler {
    VirtualContest toDomain(VirtualContestRequest request);

    VirtualContestResponse toResponse(VirtualContest domain);
}
