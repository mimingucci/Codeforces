package com.mimingucci.contest.presentation.api;

import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.ContestantCheckResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface ContestController {
    BaseResponse<ContestResponse> createContest(HttpServletRequest request, ContestCreateRequest contest);

    BaseResponse<ContestResponse> updateContest(HttpServletRequest request, Long contestId, ContestUpdateRequest contest);

    BaseResponse<ContestResponse> getContest(Long contestId);

    BaseResponse<?> deleteContest(HttpServletRequest request, Long contestId);

    BaseResponse<PageableResponse<ContestResponse>> getListContests(String name, String type, Instant start, Instant end, Pageable pageable);

    BaseResponse<ContestRegistrationDto> register(Long contestId, HttpServletRequest request, ContestRegistrationDto dto);

    BaseResponse<ContestRegistrationDto> updateRegister(Long contestId, HttpServletRequest request, ContestRegistrationDto dto);

    BaseResponse<PageableResponse<ContestRegistrationDto>> getListRegisters(Long contestId, Pageable pageable);

    BaseResponse<?> cancelRegister(HttpServletRequest request, Long contestId);

    BaseResponse<ContestRegistrationDto> getRegisterById(Long contestId, HttpServletRequest request);

    BaseResponse<Boolean> canSubmit(Long userId, Long contestId);

    BaseResponse<List<ContestRegistrationDto>> getAll(Long contestId);

    BaseResponse<ContestantCheckResponse> checkRegistration(Long contestId, Long userId);

    BaseResponse<List<ContestResponse>> getUpcomingContest(ContestType type, Integer next);

    BaseResponse<PageableResponse<ContestResponse>> getPastContest(ContestType type, Pageable pageable);

    BaseResponse<List<ContestResponse>> getRunningContest(ContestType type);

    BaseResponse<List<ContestResponse>> getAllContestsByMemberStaff(HttpServletRequest request);
}
