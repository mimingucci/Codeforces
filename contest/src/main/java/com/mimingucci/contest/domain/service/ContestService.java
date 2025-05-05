package com.mimingucci.contest.domain.service;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public interface ContestService {
    Contest createContest(Contest contest);

    Contest updateContest(Long userId, Set<Role> roles, Long id, Contest contest);

    Boolean deleteContest(Long userId, Set<Role> roles, Long id);

    Contest getContest(Long id);

    Page<Contest> getListContests(String name, String type, Instant start, Instant end, Pageable pageable);

    List<Contest> getUpcomingContests(ContestType type, Integer next);

    Page<Contest> getPastContests(ContestType type, Pageable pageable);

    List<Contest> getRunningContests(ContestType type);

    List<Contest> getAllContestsByMemberStaff(Long userId);
}
