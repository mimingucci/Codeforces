package com.mimingucci.submission.application.assembler;

import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SubmissionAssembler {
    SubmissionAssembler INSTANCE = Mappers.getMapper(SubmissionAssembler.class);

    Submission toDomain(SubmissionRequest request);

    SubmissionResponse toResponse(Submission submission);

    default PageableResponse<SubmissionResponse> pageToResponse(Page<Submission> page) {
        PageableResponse<SubmissionResponse> response = new PageableResponse<>();
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
