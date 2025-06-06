package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContestAssembler {
    ContestAssembler INSTANCE = Mappers.getMapper(ContestAssembler.class);

    Contest createToDomain(ContestCreateRequest request);

    Contest updateToDomain(ContestUpdateRequest request);

    ContestResponse domainToResponse(Contest domain);

    default PageableResponse<ContestResponse> pageToResponse(Page<Contest> page) {
        PageableResponse<ContestResponse> response = new PageableResponse<>();
        response.setContent(page.getContent().stream().map(this::domainToResponse).toList());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}
