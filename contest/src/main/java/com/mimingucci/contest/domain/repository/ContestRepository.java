package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.domain.model.Contest;

public interface ContestRepository {
    Contest createContest(Contest contest);
    Contest updateContest(Long id, Contest contest);
    Boolean deleteContest(Long id);
    Contest getContest(Long id);
}
