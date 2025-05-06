package com.mimingucci.contest.domain.service.impl;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.model.ContestRegistrationId;
import com.mimingucci.contest.domain.repository.ContestRegistrationRepository;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.domain.service.ContestRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestRegistrationServiceImpl implements ContestRegistrationService {
    private final ContestRegistrationRepository repository;

    private final ContestRepository contestRepository;

    @Override
    public ContestRegistration register(ContestRegistration domain) {
        Contest contest = this.contestRepository.getContest(domain.getContest());
        if (Instant.now().isAfter(contest.getStartTime())) throw new ApiRequestException(ErrorMessageConstants.CONTEST_HAS_STARTED, HttpStatus.BAD_REQUEST);
        return repository.register(domain);
    }

    @Override
    public Page<ContestRegistration> getAll(Long contestId, Pageable pageable) {
        return repository.getAll(contestId, pageable);
    }

    @Override
    public List<ContestRegistration> getAll(Long contestId) {
        return repository.getAll(contestId);
    }

    @Override
    public void cancelRegistration(Long contestId, Long userId) {
        Contest contest = this.contestRepository.getContest(contestId);
        if (Instant.now().isAfter(contest.getStartTime())) throw new ApiRequestException(ErrorMessageConstants.CONTEST_HAS_STARTED, HttpStatus.BAD_REQUEST);
        repository.deleteRegistration(new ContestRegistrationId(userId, contestId));
    }

    @Override
    public ContestRegistration update(ContestRegistration domain) {
        Contest contest = this.contestRepository.getContest(domain.getContest());
        if (Instant.now().isAfter(contest.getStartTime())) throw new ApiRequestException(ErrorMessageConstants.CONTEST_HAS_STARTED, HttpStatus.BAD_REQUEST);
        return repository.updateRegister(domain);
    }

    @Override
    public ContestRegistration getById(Long userId, Long contestId) {
        return repository.getById(userId, contestId);
    }

    @Override
    public Boolean checkUserCanSubmit(Long userId, Long contestId) {
        Contest contest = this.contestRepository.getContest(contestId);
        if (Instant.now().isAfter(contest.getEndTime())) return true;
        if (Instant.now().isBefore(contest.getStartTime())) return false;
        ContestRegistration registration = this.repository.getById(userId, contestId);
        return registration != null;
    }
}
