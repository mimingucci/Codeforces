package com.mimingucci.contest.presentation.api;

import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

public interface ContestController {
    BaseResponse<ContestResponse> createContest(HttpServletRequest request, ContestCreateRequest contest);

    BaseResponse<ContestResponse> updateContest(HttpServletRequest request, Long contestId, ContestUpdateRequest contest);

    BaseResponse<ContestResponse> getContest(Long contestId);

    BaseResponse deleteContest(HttpServletRequest request, Long contestId);

    BaseResponse<PageableResponse<ContestResponse>> getListContests(@RequestParam(name = "name", defaultValue = "") String name, Pageable pageable);
}
