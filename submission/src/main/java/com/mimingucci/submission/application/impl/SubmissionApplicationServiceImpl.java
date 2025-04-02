package com.mimingucci.submission.application.impl;

import com.mimingucci.submission.application.SubmissionApplicationService;
import com.mimingucci.submission.application.assembler.SubmissionAssembler;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.service.SubmissionService;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionApplicationServiceImpl implements SubmissionApplicationService {

    private final SubmissionService service;

    @Override
    public SubmissionResponse getSubmissionById(Long id) {
        return SubmissionAssembler.INSTANCE.toResponse(service.findById(id));
    }

    @Override
    public SubmissionResponse createSubmission(SubmissionRequest request, HttpServletRequest httpServletRequest) {
        request.setAuthor((Long) httpServletRequest.getAttribute("userId"));
        return SubmissionAssembler.INSTANCE.toResponse(service.createSubmission(SubmissionAssembler.INSTANCE.toDomain(request)));
    }

    @Override
    public PageableResponse<SubmissionResponse> getPageSubmissionsByUserId(Long userId, Pageable pageable) {
        return SubmissionAssembler.INSTANCE.pageToResponse(service.findAllByUserId(userId, pageable));
    }
}
