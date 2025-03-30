package com.mimingucci.contest.domain.service;

import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.domain.model.Contest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface ContestService {
    Contest createContest(Contest contest);

    Contest updateContest(Long userId, Set<Role> roles, Long id, Contest contest);

    Boolean deleteContest(Long userId, Set<Role> roles, Long id);

    Contest getContest(Long id);

    Page<Contest> getListContests(String name, Pageable pageable);
}
