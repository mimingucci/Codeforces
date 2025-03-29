package com.mimingucci.contest.presentation.api;

import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;

public interface ContestController {
    BaseResponse<ContestResponse> createContest();
}
