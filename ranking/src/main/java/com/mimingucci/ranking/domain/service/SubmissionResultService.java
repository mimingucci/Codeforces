package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.domain.event.ContestEvent;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;

import java.util.List;

public interface SubmissionResultService {
    void start_contest(ContestEvent event);

    void process_submission_event(SubmissionResultEvent event);

    void recalculate_ranks(Long contestId);

    List<LeaderboardEntry> getLeaderBoard(Long contestId);
}
