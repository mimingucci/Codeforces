package com.mimingucci.contest.application;

import com.mimingucci.contest.presentation.dto.request.ContestRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;

public interface ContestApplicationService {
    ContestResponse createContest(ContestRequest contest);

    ContestResponse getContest(Long contestId);

    ContestResponse updateContest(Long contestId, ContestRequest contest);

    void deleteContest(Long contestId);
}
