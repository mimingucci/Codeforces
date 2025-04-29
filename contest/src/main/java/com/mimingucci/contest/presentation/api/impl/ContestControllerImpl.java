package com.mimingucci.contest.presentation.api.impl;

import com.mimingucci.contest.application.ContestApplicationService;
import com.mimingucci.contest.common.constant.PathConstants;
import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.api.ContestController;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.ContestantCheckResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_CONTEST)
public class ContestControllerImpl implements ContestController {
    private final ContestApplicationService service;

    @GetMapping(path = PathConstants.UP_COMING)
    @Override
    public BaseResponse<List<ContestResponse>> getUpcomingContest(@RequestParam(name = "type", defaultValue = "SYSTEM") ContestType type,@RequestParam(name = "next", defaultValue = "7") Integer next) {
        return BaseResponse.success(service.getUpcomingContests(type, next));
    }

    @GetMapping(path = PathConstants.PAST)
    @Override
    public BaseResponse<PageableResponse<ContestResponse>> getPastContest(@RequestParam(name = "type", defaultValue = "SYSTEM") ContestType type, Pageable pageable) {
        return BaseResponse.success(service.getPastContests(type, pageable));
    }

    @GetMapping(path = PathConstants.RUNNING)
    @Override
    public BaseResponse<List<ContestResponse>> getRunningContest(@RequestParam(name = "type", defaultValue = "SYSTEM") ContestType type) {
        return BaseResponse.success(service.getRunningContests(type));
    }

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION + PathConstants.PAGEABLE)
    @Override
    public BaseResponse<PageableResponse<ContestRegistrationDto>> getListRegisters(@PathVariable(name = "contestId") Long contestId, Pageable pageable) {
        return BaseResponse.success(service.getListRegisters(contestId, pageable));
    }

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION + PathConstants.ALL)
    @Override
    public BaseResponse<List<ContestRegistrationDto>> getAll(@PathVariable(name = "contestId") Long contestId) {
        return BaseResponse.success(service.getAll(contestId));
    }

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION + PathConstants.USER_ID)
    @Override
    public BaseResponse<ContestantCheckResponse> checkRegistration(@PathVariable(name = "contestId") Long contestId, @PathVariable(name = "userId") Long userId) {
        return BaseResponse.success(service.checkRegister(contestId, userId));
    }

    @PostMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION)
    @Override
    public BaseResponse<ContestRegistrationDto> register(@PathVariable(name = "contestId") Long contestId, HttpServletRequest request, @RequestBody @Validated ContestRegistrationDto dto) {
        dto.setContest(contestId);
        return BaseResponse.success(service.registerContest((Long) request.getAttribute("userId"), dto));
    }

    @PutMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION)
    @Override
    public BaseResponse<ContestRegistrationDto> updateRegister(@PathVariable(name = "contestId") Long contestId, HttpServletRequest request, @RequestBody @Validated ContestRegistrationDto dto) {
        dto.setContest(contestId);
        return BaseResponse.success(service.updateRegister((Long) request.getAttribute("userId"), dto));
    }

    @DeleteMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION)
    @Override
    public BaseResponse<?> cancelRegister(HttpServletRequest request, @PathVariable(name = "contestId") Long contestId) {
        service.cancelRegister((Long) request.getAttribute("userId"), contestId);
        return BaseResponse.success();
    }

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION)
    @Override
    public BaseResponse<ContestRegistrationDto> getRegisterById(@PathVariable(name = "contestId") Long contestId, HttpServletRequest request) {
        return BaseResponse.success(service.getRegisterById((Long) request.getAttribute("userId"), contestId));
    }

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.CHECK)
    @Override
    public BaseResponse<Boolean> canSubmit(@RequestParam(required = true, name = "userId") Long userId, @PathVariable(name = "contestId") Long contestId) {
        return BaseResponse.success(service.checkUserCanSubmit(userId, contestId));
    }

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

    @GetMapping(path = PathConstants.ALL)
    @Override
    public BaseResponse<PageableResponse<ContestResponse>> getListContests(@RequestParam(name = "name", defaultValue = "") String name, Pageable pageable) {
        return BaseResponse.success(service.getListContests(name, pageable));
    }
}
