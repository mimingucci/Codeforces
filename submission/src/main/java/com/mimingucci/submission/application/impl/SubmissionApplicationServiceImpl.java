package com.mimingucci.submission.application.impl;

import com.mimingucci.submission.application.SubmissionApplicationService;
import com.mimingucci.submission.application.assembler.MossDetectionAssembler;
import com.mimingucci.submission.application.assembler.SubmissionAssembler;
import com.mimingucci.submission.common.constant.ErrorMessageConstants;
import com.mimingucci.submission.common.enums.Role;
import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.common.exception.ApiRequestException;
import com.mimingucci.submission.domain.model.MossDetection;
import com.mimingucci.submission.domain.service.MossService;
import com.mimingucci.submission.domain.service.SubmissionService;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.request.VirtualSubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.MossPlagiarismResponse;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionGridResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import static com.mimingucci.submission.common.enums.Role.*;

@Service
@RequiredArgsConstructor
public class SubmissionApplicationServiceImpl implements SubmissionApplicationService {

    private final SubmissionService service;

    private final MossService mossService;

    private final MossDetectionAssembler mossDetectionAssembler;

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

    @Override
    public List<SubmissionGridResponse> getSubmissionGrid(Long userId, Instant startDate, Instant endDate) {
        return service.getSubmissionGrid(userId, startDate, endDate).stream().map(SubmissionAssembler.INSTANCE::toGrid).toList();
    }

    @Override
    public SubmissionResponse createVirtualSubmission(VirtualSubmissionRequest request, HttpServletRequest httpServletRequest) {
        request.setAuthor((Long) httpServletRequest.getAttribute("userId"));
        return SubmissionAssembler.INSTANCE.toResponse(service.createVirtualSubmission(request.getVirtualContest(), SubmissionAssembler.INSTANCE.toDomainFromVirtual(request)));
    }

    @Override
    public MossPlagiarismResponse runMoss(Long contestId, SubmissionLanguage language, HttpServletRequest request) {
        try {
            Set<Role> roles = (Set<Role>) request.getAttribute("userRoles");
            if (!roles.contains(ADMIN) && !roles.contains(SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.NOT_ACCEPTABLE);

            MossDetection detection = mossService.detectPlagiarism(contestId, language);
            MossPlagiarismResponse response = mossDetectionAssembler.toResponse(detection);
            response.setMessage("Plagiarism detection started. Check status using GET endpoint.");

            return response;
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public MossPlagiarismResponse getMossDetection(Long contestId, SubmissionLanguage language, HttpServletRequest request) {
        try {
            Set<Role> roles = (Set<Role>) request.getAttribute("userRoles");
            if (!roles.contains(ADMIN) && !roles.contains(SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.NOT_ACCEPTABLE);

            MossDetection detection = mossService.getByContestIdAndLanguage(contestId, language);
            if (detection == null) {
                throw new ApiRequestException("No plagiarism detection found for this contest and language", HttpStatus.NOT_FOUND);
            }

            return mossDetectionAssembler.toResponse(detection);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public List<MossPlagiarismResponse> getMossDetections(Long contestId, HttpServletRequest request) {
        try {
            Set<Role> roles = (Set<Role>) request.getAttribute("userRoles");
            if (!roles.contains(ADMIN) && !roles.contains(SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.NOT_ACCEPTABLE);
            return mossService.getAllByContestId(contestId).stream().map(mossDetectionAssembler::toResponse).toList();
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }
}
