package com.mimingucci.contest.domain.service;

import com.mimingucci.contest.domain.model.VirtualContest;

public interface VirtualContestService {
    VirtualContest createOne(VirtualContest domain);

    VirtualContest getNewestOne(Long user);
}
