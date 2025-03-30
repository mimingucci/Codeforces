package com.mimingucci.contest.presentation.api.impl;

import com.mimingucci.contest.application.ContestApplicationService;
import com.mimingucci.contest.common.constant.PathConstants;
import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.presentation.api.ContestController;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_CONTEST)
public class ContestControllerImpl implements ContestController {
    private final ContestApplicationService service;

    @PostMapping
    @Override
    public BaseResponse<ContestResponse> createContest(HttpServletRequest request, @RequestBody @Validated ContestCreateRequest contest) {
        return BaseResponse.success(service.createContest(contest));
    }

    @PutMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<ContestResponse> updateContest(HttpServletRequest request, @PathVariable(name = "contestId") Long contestId, @RequestBody @Validated ContestUpdateRequest contest) {
        return BaseResponse.success(service.updateContest((Long) request.getAttribute("userId"), (Set<Role>) request.getAttribute("userRoles"), contestId, contest));
    }

    @GetMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<ContestResponse> getContest(@PathVariable(name = "contestId") Long contestId) {
        return BaseResponse.success(service.getContest(contestId));
    }

    @DeleteMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<?> deleteContest(HttpServletRequest request, @PathVariable(name = "contestId") Long contestId) {
        service.deleteContest((Long) request.getAttribute("userId"), (Set<Role>) request.getAttribute("userRoles"), contestId);
        return BaseResponse.success();
    }

    @Override
    public BaseResponse<PageableResponse<ContestResponse>> getListContests(String name, Pageable pageable) {
        return BaseResponse.success(service.getListContests(name, pageable));
    }
}
