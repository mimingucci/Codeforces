package com.mimingucci.contest.presentation.api;

import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface ContestController {
    BaseResponse<ContestResponse> createContest(HttpServletRequest request, ContestCreateRequest contest);

    BaseResponse<ContestResponse> updateContest(HttpServletRequest request, Long contestId, ContestUpdateRequest contest);

    BaseResponse<ContestResponse> getContest(Long contestId);

    BaseResponse<?> deleteContest(HttpServletRequest request, Long contestId);

    BaseResponse<PageableResponse<ContestResponse>> getListContests(String name, Pageable pageable);

    BaseResponse<ContestRegistrationDto> register(Long contestId, HttpServletRequest request, ContestRegistrationDto dto);

    BaseResponse<ContestRegistrationDto> updateRegister(Long contestId, HttpServletRequest request, ContestRegistrationDto dto);

    BaseResponse<PageableResponse<ContestRegistrationDto>> getListRegisters(Long contestId, Pageable pageable);

    BaseResponse<?> cancelRegister(HttpServletRequest request, Long contestId);

    BaseResponse<ContestRegistrationDto> getRegisterById(Long contestId, HttpServletRequest request);

    BaseResponse<Boolean> canSubmit(Long userId, Long contestId);
}
