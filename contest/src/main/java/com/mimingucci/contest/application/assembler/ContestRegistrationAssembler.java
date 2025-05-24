package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContestRegistrationAssembler {
    ContestRegistrationAssembler INSTANCE = Mappers.getMapper(ContestRegistrationAssembler.class);

    ContestRegistration toDomain(ContestRegistrationDto dto);

    ContestRegistrationDto toResponse(ContestRegistration domain);

    default PageableResponse<ContestRegistrationDto> pageToResponse(Page<ContestRegistration> page) {
        PageableResponse<ContestRegistrationDto> response = new PageableResponse<>();
        response.setContent(page.getContent().stream().map(this::toResponse).toList());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}
