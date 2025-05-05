package com.mimingucci.contest.application;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.ContestantCheckResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public interface ContestApplicationService {
    ContestResponse createContest(ContestCreateRequest contest);

    ContestResponse getContest(Long contestId);

    ContestResponse updateContest(Long userId, Set<Role> roles, Long contestId, ContestUpdateRequest contest);

    void deleteContest(Long userId, Set<Role> roles, Long contestId);

    PageableResponse<ContestResponse> getListContests(String name, String type, Instant start, Instant end, Pageable pageable);

    // register
    ContestRegistrationDto registerContest(Long userId, ContestRegistrationDto request);

    PageableResponse<ContestRegistrationDto> getListRegisters(Long contestId, Pageable pageable);

    ContestRegistrationDto getRegisterById(Long contestId, HttpServletRequest request);

    ContestRegistrationDto updateRegister(Long userId, ContestRegistrationDto request);

    void cancelRegister(Long userId, Long contestId);

    Boolean checkUserCanSubmit(Long userId, Long contestId);

    List<ContestRegistrationDto> getAll(Long contestId);

    ContestantCheckResponse checkRegister(Long contestId, Long userId);

    List<ContestResponse> getUpcomingContests(ContestType type, Integer next);

    PageableResponse<ContestResponse> getPastContests(ContestType type, Pageable pageable);

    List<ContestResponse> getRunningContests(ContestType type);

    List<ContestResponse> getAllContestsByMemberStaff(HttpServletRequest request);
}
