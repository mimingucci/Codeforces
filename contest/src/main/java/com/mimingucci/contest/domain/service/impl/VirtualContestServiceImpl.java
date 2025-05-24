package com.mimingucci.contest.domain.service.impl;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.event.VirtualContestCreatedEvent;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.domain.repository.VirtualContestRepository;
import com.mimingucci.contest.domain.service.VirtualContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class VirtualContestServiceImpl implements VirtualContestService {
    private final VirtualContestRepository virtualContestRepository;

    private final ContestRepository contestRepository;

    private final ApplicationEventPublisher eventPublisher;

    @Override
    public VirtualContest createOne(VirtualContest domain) {
        if (domain.getStartTime().isBefore(Instant.now())) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_GATEWAY);
        }

        // check if user has not finished virtual contest yet
        VirtualContest virtualContest = this.virtualContestRepository.getNearestOne(domain.getUser());

        if (virtualContest != null && Instant.now().isBefore(virtualContest.getEndTime())) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_GATEWAY);
        }

        Contest contest = this.contestRepository.getContest(domain.getContest());
        if (contest == null || Instant.now().isBefore(contest.getEndTime())) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_GATEWAY);
        }

        // okay
        // contest's duration
        Duration duration = Duration.between(contest.getStartTime(), contest.getEndTime());
        domain.setEndTime(domain.getStartTime().plus(duration));

        domain.setActualStartTime(contest.getStartTime());
        domain.setActualEndTime(contest.getEndTime());
        VirtualContest virtualContest1 = this.virtualContestRepository.create(domain);
        eventPublisher.publishEvent(new VirtualContestCreatedEvent(virtualContest1));
        return virtualContest1;
    }

    @Override
    public VirtualContest getNewestOne(Long user) {
        return this.virtualContestRepository.getNearestOne(user);
    }
}
