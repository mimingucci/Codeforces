package com.mimingucci.contest.application.impl;

import com.mimingucci.contest.application.ContestApplicationService;
import com.mimingucci.contest.application.assembler.ContestAssembler;
import com.mimingucci.contest.application.assembler.ContestRegistrationAssembler;
import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.common.util.JwtUtil;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.service.ContestRegistrationService;
import com.mimingucci.contest.domain.service.ContestService;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.ContestantCheckResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContestApplicationServiceImpl implements ContestApplicationService {

    private final JwtUtil jwtUtil;

    private final ContestService service;

    private final ContestRegistrationService registrationService;

    @Override
    public ContestResponse createContest(ContestCreateRequest contest) {
        return ContestAssembler.INSTANCE.domainToResponse(this.service.createContest(ContestAssembler.INSTANCE.createToDomain(contest)));
    }

    @Override
    public ContestResponse getContest(Long contestId) {
        return ContestAssembler.INSTANCE.domainToResponse(this.service.getContest(contestId));
    }

    @Override
    public ContestResponse updateContest(Long userId, Set<Role> roles, Long contestId, ContestUpdateRequest contest) {
        return ContestAssembler.INSTANCE.domainToResponse(this.service.updateContest(userId, roles, contestId, ContestAssembler.INSTANCE.updateToDomain(contest)));
    }

    @Override
    public void deleteContest(Long userId, Set<Role> roles, Long contestId) {
        this.service.deleteContest(userId, roles, contestId);
    }

    @Override
    public PageableResponse<ContestResponse> getListContests(String name, Pageable pageable) {
        return ContestAssembler.INSTANCE.pageToResponse(this.service.getListContests(name, pageable));
    }

    @Override
    public ContestRegistrationDto registerContest(Long userId, ContestRegistrationDto request) {
        request.setUser(userId);
        return ContestRegistrationAssembler.INSTANCE.toResponse(registrationService.register(ContestRegistrationAssembler.INSTANCE.toDomain(request)));
    }

    @Override
    public PageableResponse<ContestRegistrationDto> getListRegisters(Long contestId, Pageable pageable) {
        return ContestRegistrationAssembler.INSTANCE.pageToResponse(registrationService.getAll(contestId, pageable));
    }

    @Override
    public ContestRegistrationDto getRegisterById(Long contestId, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return ContestRegistrationAssembler.INSTANCE.toResponse(registrationService.getById(userId, contestId));
    }

    @Override
    public ContestRegistrationDto updateRegister(Long userId, ContestRegistrationDto request) {
        request.setUser(userId);
        return ContestRegistrationAssembler.INSTANCE.toResponse(registrationService.update(ContestRegistrationAssembler.INSTANCE.toDomain(request)));
    }

    @Override
    public void cancelRegister(Long userId, Long contestId) {
        registrationService.cancelRegistration(contestId, userId);
    }

    @Override
    public Boolean checkUserCanSubmit(Long userId, Long contestId) {
        return registrationService.checkUserCanSubmit(userId, contestId);
    }

    @Override
    public List<ContestRegistrationDto> getAll(Long contestId) {
        return registrationService.getAll(contestId).stream().map(ContestRegistrationAssembler.INSTANCE::toResponse).toList();
    }

    @Override
    public ContestantCheckResponse checkRegister(Long contestId, Long userId) {
        Contest contest = service.getContest(contestId);
        ContestRegistration registration = registrationService.getById(userId, contestId);
        return new ContestantCheckResponse(contestId, contest.getStartTime(), contest.getEndTime(), registration.getUser(), registration.getRated(), registration.getParticipated(), contest.getType());
    }

    @Override
    public List<ContestResponse> getUpcomingContests(ContestType type, Integer next) {
        return service.getUpcomingContests(type, next).stream().map(ContestAssembler.INSTANCE::domainToResponse).toList();
    }

    @Override
    public PageableResponse<ContestResponse> getPastContests(ContestType type, Pageable pageable) {
        return ContestAssembler.INSTANCE.pageToResponse(service.getPastContests(type, pageable));
    }

    @Override
    public List<ContestResponse> getRunningContests(ContestType type) {
        return service.getRunningContests(type).stream().map(ContestAssembler.INSTANCE::domainToResponse).toList();
    }
}
