package com.mimingucci.ranking.domain.repository;

import com.mimingucci.ranking.domain.event.SubmissionResultEvent;

import java.util.List;

public interface SubmissionResultRepository {
    void saveSubmissionResultEventsDuringContest(List<SubmissionResultEvent> events);

    List<SubmissionResultEvent> findByContestId(Long contest);
}
