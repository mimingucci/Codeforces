package com.mimingucci.contest.domain.service.impl;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.event.ContestCreatedEvent;
import com.mimingucci.contest.domain.event.ContestDeletedEvent;
import com.mimingucci.contest.domain.event.ContestUpdatedEvent;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.domain.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {
    private final ContestRepository contestRepository;

    private final ApplicationEventPublisher eventPublisher;

    @Override
    public Contest createContest(Contest domain) {
        Contest contest = contestRepository.createContest(domain);
        eventPublisher.publishEvent(new ContestCreatedEvent(contest));
        return contest;
    }

    @Override
    public Contest updateContest(Long userId, Set<Role> roles, Long id, Contest domain) {
        Contest contest = contestRepository.updateContest(userId, roles, id, domain);
        if (domain.getStartTime() != null || domain.getEndTime() != null)
            eventPublisher.publishEvent(new ContestUpdatedEvent(contest));
        return contest;
    }

    @Override
    public Boolean deleteContest(Long userId, Set<Role> roles, Long id) {
        Boolean rep = contestRepository.deleteContest(userId, roles, id);
        if (rep) eventPublisher.publishEvent(new ContestDeletedEvent(id));
        return rep;
    }

    @Override
    public Contest getContest(Long id) {
        return contestRepository.getContest(id);
    }

    @Override
    public Page<Contest> getListContests(String name, Pageable pageable) {
        return contestRepository.getListContests(name, pageable);
    }
}
