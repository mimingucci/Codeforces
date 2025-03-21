package com.mimingucci.problem.application.assembler;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.PageableResponse;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class ProblemAssembler {
    public PageableResponse<ProblemResponse> pageToResponse(Page<Problem> page) {
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

    public abstract ProblemResponse domainToResponse(Problem domain);

    public abstract Problem createToDomain(ProblemCreateRequest request);

    public abstract Problem updateToDomain(ProblemUpdateRequest request);
}