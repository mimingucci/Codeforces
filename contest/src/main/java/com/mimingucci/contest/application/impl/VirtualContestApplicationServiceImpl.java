package com.mimingucci.contest.application.impl;

import com.mimingucci.contest.application.VirtualContestApplicationService;
import com.mimingucci.contest.application.assembler.VirtualContestAssembler;
import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.service.VirtualContestService;
import com.mimingucci.contest.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.contest.presentation.dto.response.VirtualContestResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VirtualContestApplicationServiceImpl implements VirtualContestApplicationService {
    private final VirtualContestService service;

    private final VirtualContestAssembler assembler;

    @Override
    public VirtualContestResponse createOne(VirtualContestRequest request, HttpServletRequest servletRequest) {
        try {
            Long userId = (Long) servletRequest.getAttribute("userId");
            request.setUser(userId);
            return this.assembler.toResponse(this.service.createOne(this.assembler.toDomain(request)));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public VirtualContestResponse getNewestOne(Long userId) {
        return this.assembler.toResponse(this.service.getNewestOne(userId));
    }
}
