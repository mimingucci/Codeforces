package com.mimingucci.contest.application;

import com.mimingucci.contest.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.contest.presentation.dto.response.VirtualContestResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface VirtualContestApplicationService {
    VirtualContestResponse createOne(VirtualContestRequest request, HttpServletRequest servletRequest);

    VirtualContestResponse getNewestOne(Long userId);
}
