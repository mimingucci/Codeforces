package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.domain.model.VirtualContest;

public interface VirtualContestRepository {
    VirtualContest create(VirtualContest domain);

    VirtualContest getById(Long id);

    VirtualContest getNearestOne(Long user);
}
