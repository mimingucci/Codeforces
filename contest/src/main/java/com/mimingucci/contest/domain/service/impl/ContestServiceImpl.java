package com.mimingucci.contest.domain.service.impl;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.domain.service.ContestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {
    private final ContestRepository contestRepository;

    @Override
    public Contest createContest(Contest contest) {
        return contestRepository.createContest(contest);
    }

    @Override
    public Contest updateContest(Long userId, Set<Role> roles, Long id, Contest contest) {
        return contestRepository.updateContest(userId, roles, id, contest);
    }

    @Override
    public Boolean deleteContest(Long userId, Set<Role> roles, Long id) {
        return contestRepository.deleteContest(userId, roles, id);
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
