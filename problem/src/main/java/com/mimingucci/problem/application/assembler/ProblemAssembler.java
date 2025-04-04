package com.mimingucci.problem.application.assembler;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProblemAssembler {
    ProblemAssembler INSTANCE = Mappers.getMapper(ProblemAssembler.class);

    default PageableResponse<ProblemResponse> pageToResponse(Page<Problem> page) {
        PageableResponse<ProblemResponse> response = new PageableResponse<>();
        response.setContent(page.getContent().stream().map(this::domainToResponse).toList());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }

    ProblemResponse domainToResponse(Problem domain);

    Problem createToDomain(ProblemCreateRequest request);

    Problem updateToDomain(ProblemUpdateRequest request);
}