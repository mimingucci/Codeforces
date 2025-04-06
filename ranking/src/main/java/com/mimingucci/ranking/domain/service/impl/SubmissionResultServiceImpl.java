package com.mimingucci.ranking.domain.service.impl;

import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import com.mimingucci.ranking.domain.event.ContestEvent;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.service.SubmissionResultService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class SubmissionResultServiceImpl implements SubmissionResultService {
    private Map<Long, Map<Long, LeaderboardEntry>> contest_standings = new HashMap<>();

    private Set<Long> active_contests = new HashSet<>();

    private Map<Long, ContestEvent> contests_metadata = new HashMap<>();

    private Map<Long, List<SubmissionResultEvent>> submission_cache = new HashMap<>();

    @Override
    public void start_contest(ContestEvent event) {
        this.active_contests.add(event.getId());
        this.contests_metadata.put(event.getId(), event);
        this.submission_cache.put(event.getId(), new ArrayList<>());
        this.contest_standings.put(event.getId(), new HashMap<>());
    }


    @Override
    public void process_submission_event(SubmissionResultEvent event) {
        if (!this.active_contests.contains(event.getContest())) return;
        if (event.getJudged_on().isBefore(this.contests_metadata.get(event.getContest()).getStartTime())
            || event.getJudged_on().isAfter(this.contests_metadata.get(event.getContest()).getEndTime()))
            return;
        if (!this.contest_standings.get(event.getContest()).containsKey(event.getAuthor())) {
            this.contest_standings.get(event.getContest()).put(event.getAuthor(), new LeaderboardEntry());
        }

        this.submission_cache.get(event.getContest()).add(event);

        LeaderboardEntry user_standing = this.contest_standings.get(event.getContest()).get(event.getAuthor());

        if (!user_standing.getProblemAttempts().containsKey(event.getProblem())) {
            user_standing.getProblemAttempts().put(event.getProblem(), 0);
        }

        int old_penalty = user_standing.getPenalty();
        int old_attemps = user_standing.getProblemAttempts().get(event.getProblem());
        int penalty = old_penalty - old_attemps * 10;
        if (user_standing.getProblemSolveTimes().containsKey(event.getProblem())) {
            penalty -= user_standing.getProblemSolveTimes().get(event.getProblem());
        }

        user_standing.getProblemAttempts().compute(event.getProblem(), (k, attemp) -> attemp + 1);

        if (event.getVerdict().equals(SubmissionVerdict.ACCEPT)) {
            int solve_time = (int) Duration.between(event.getJudged_on(), this.contests_metadata.get(event.getContest()).getStartTime()).toMinutes();
            user_standing.getProblemSolveTimes().put(event.getProblem(), solve_time);

            user_standing.setTotalScore(event.getScore());
            int attemps = user_standing.getProblemAttempts().get(event.getProblem());
            penalty += attemps * 10 + solve_time;
            user_standing.setPenalty(penalty);
        } else {
            penalty += (old_attemps + 1) * 10 + user_standing.getProblemSolveTimes().get(event.getProblem());
            user_standing.setPenalty(penalty);
        }

        this.recalculate_ranks(event.getContest());
    }

    @Override
    public void recalculate_ranks(Long contestId) {
        if (!this.active_contests.contains(contestId)) return;
        Map<Long, LeaderboardEntry> participants = this.contest_standings.get(contestId);
        List<LeaderboardEntry> sortedEntries = participants.values().stream()
                .sorted(Comparator.comparing(LeaderboardEntry::getTotalScore, Comparator.reverseOrder())
                        .thenComparing(LeaderboardEntry::getPenalty))
                .toList();

        int currentRank = 1;
        int actualIndex = 1;
        LeaderboardEntry prev = null;

        for (LeaderboardEntry entry : sortedEntries) {
            if (prev != null &&
                    entry.getTotalScore().equals(prev.getTotalScore()) &&
                    entry.getPenalty().equals(prev.getPenalty())) {
                // same as previous → same rank
                entry.setRank(currentRank);
            } else {
                // new rank
                currentRank = actualIndex;
                entry.setRank(currentRank);
            }
            actualIndex++;
            prev = entry;

            participants.put(entry.getUserId(), entry);
        }

        this.contest_standings.put(contestId, participants);
    }

    @Override
    public List<LeaderboardEntry> getLeaderBoard(Long contestId) {
        return this.contest_standings.get(contestId).values().stream().sorted(Comparator.comparing(LeaderboardEntry::getRank)).toList();
    }
}
