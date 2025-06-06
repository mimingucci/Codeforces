package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public interface ContestRepository {
    Contest createContest(Contest contest);
    Contest updateContest(Long userId, Set<Role> roles, Long id, Contest contest);
    Boolean deleteContest(Long userId, Set<Role> roles, Long id);
    Contest getContest(Long id);
    Contest getStaredContestById(Long id);

    List<Contest> findContestsRelevantForPeriod(Instant startTime, Instant endTime);

    List<Contest> findAllContestsByMemberStaff(Long userId);

    Page<Contest> getListContests(String name, ContestType type, Instant start, Instant end, Pageable pageable);

    List<Contest> getUpcomingSystemContests();

    List<Contest> getUpcomingContest(ContestType type, Instant now, Instant plus);

    Page<Contest> getPastContests(ContestType type, Pageable pageable);

    List<Contest> getRunningContests(ContestType type);
}
