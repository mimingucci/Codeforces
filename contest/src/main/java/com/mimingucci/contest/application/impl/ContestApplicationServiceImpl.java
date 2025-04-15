package com.mimingucci.contest.application.impl;

import com.mimingucci.contest.application.ContestApplicationService;
import com.mimingucci.contest.application.assembler.ContestAssembler;
import com.mimingucci.contest.application.assembler.ContestRegistrationAssembler;
import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.service.ContestRegistrationService;
import com.mimingucci.contest.domain.service.ContestService;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import com.mimingucci.contest.presentation.dto.response.PageableResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContestApplicationServiceImpl implements ContestApplicationService {

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
    public ContestRegistrationDto getRegisterById(Long userId, Long contestId) {
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
}
