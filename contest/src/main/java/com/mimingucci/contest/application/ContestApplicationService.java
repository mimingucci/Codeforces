package com.mimingucci.contest.application;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface ContestApplicationService {
    ContestResponse createContest(ContestCreateRequest contest);

    ContestResponse getContest(Long contestId);

    ContestResponse updateContest(Long userId, Set<Role> roles, Long contestId, ContestUpdateRequest contest);

    void deleteContest(Long userId, Set<Role> roles, Long contestId);

    PageableResponse<ContestResponse> getListContests(String name, Pageable pageable);
}
