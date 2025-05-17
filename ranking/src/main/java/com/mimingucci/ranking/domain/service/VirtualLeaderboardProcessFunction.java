package com.mimingucci.ranking.domain.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.common.enums.SubmissionType;
import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import com.mimingucci.ranking.common.util.ContestantsConverter;
import com.mimingucci.ranking.domain.client.response.ContestRegistrationResponse;
import com.mimingucci.ranking.domain.event.VirtualSubmissionResultEvent;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.LeaderboardUpdate;
import com.mimingucci.ranking.domain.model.VirtualLeaderboardUpdateSerializable;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.state.MapState;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Slf4j
public class VirtualLeaderboardProcessFunction extends KeyedProcessFunction<Long, VirtualSubmissionResultEvent, VirtualLeaderboardUpdateSerializable> {

    private transient MapState<Long, LeaderboardEntry> leaderboard;

    public VirtualLeaderboardProcessFunction() {}

    @Override
    public void open(Configuration parameters) {
        MapStateDescriptor<Long, LeaderboardEntry> desc =
                new MapStateDescriptor<>("virtualLeaderboardState", Long.class, LeaderboardEntry.class);
        leaderboard = getRuntimeContext().getMapState(desc);
    }

    public List<LeaderboardEntry> recalculate_ranks() throws Exception{
        List<LeaderboardEntry> sortedEntries = new ArrayList<>();
        for (LeaderboardEntry entry : leaderboard.values()) sortedEntries.add(entry);
        sortedEntries.sort(Comparator.comparing(LeaderboardEntry::getTotalScore, Comparator.reverseOrder())
                .thenComparing(LeaderboardEntry::getPenalty));

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
        }

        return sortedEntries;
    }

    @Override
    public void processElement(VirtualSubmissionResultEvent event, Context ctx, Collector<VirtualLeaderboardUpdateSerializable> out) throws Exception {
        if (event.getEventType().equals(SubmissionType.CONTEST_STARTED) || event.getEventType().equals(SubmissionType.CONTEST_ENDED)) {
            if (event.getEventType().equals(SubmissionType.CONTEST_STARTED)) {
                log.info("Contest has started");
                List<ContestRegistrationResponse> contestants = ContestantsConverter.fromJsonString(event.getContestants());
                List<Long> problemset = event.getProblemset() == null || event.getProblemset().trim().isEmpty()
                        ? List.of() // Return empty list if null or empty
                        : Arrays.stream(event.getProblemset().split(","))
                        .filter(s -> !s.trim().isEmpty()) // Filter out empty strings
                        .map(Long::parseLong)
                        .toList();
                for (var contestant : contestants) {
                    LeaderboardEntry entry = new LeaderboardEntry();
                    entry.setUserId(contestant.getUser());
                    entry.setContestId(event.getContest());
                    entry.setRated(contestant.getRated());
                    for (long problem : problemset) {
                        entry.getProblemAttempts().put(problem, 0);
                    }
                    leaderboard.put(contestant.getUser(), entry);
                }
                List<LeaderboardEntry> sortedEntries = recalculate_ranks();

                ObjectMapper mapper = new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                String json = mapper.writeValueAsString(new LeaderboardUpdate(event.getContest(), sortedEntries));
                out.collect(new VirtualLeaderboardUpdateSerializable(event.getVirtualContest(), json));
            } else {
                log.info("Contest ended");
                List<LeaderboardEntry> sortedEntries = recalculate_ranks();

                ObjectMapper mapper = new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                String json = mapper.writeValueAsString(new LeaderboardUpdate(event.getContest(), sortedEntries));
                out.collect(new VirtualLeaderboardUpdateSerializable(event.getVirtualContest(), json));

                // Write submission history to file before clearing

                leaderboard.clear();
            }
            return;
        }

        if (event.getSent_on().isBefore(event.getStartTime())) return;
        if (event.getSent_on().isAfter(event.getEndTime())) return;

        LeaderboardEntry entry = leaderboard.get(event.getAuthor());
        if (entry == null) {
            entry = new LeaderboardEntry();
            entry.setUserId(event.getAuthor());
            entry.setContestId(event.getContest());
        }

        if (!entry.getProblemAttempts().containsKey(event.getProblem())) {
            entry.getProblemAttempts().put(event.getProblem(), 0);
        }

        int old_penalty = entry.getPenalty();
        int old_attemps = entry.getProblemAttempts().get(event.getProblem());
        int penalty = old_penalty - old_attemps * 10;
        if (entry.getProblemSolveTimes().containsKey(event.getProblem())) {
            penalty -= entry.getProblemSolveTimes().get(event.getProblem());
        }

        entry.getProblemAttempts().compute(event.getProblem(), (k, attemp) -> attemp + 1);

        if (event.getVerdict().equals(SubmissionVerdict.ACCEPT)) {
            int solve_time = (int) Duration.between(event.getStartTime(), event.getSent_on()).toMinutes();
            entry.getProblemSolveTimes().put(event.getProblem(), solve_time);
            entry.getSolvedProblems().add(event.getProblem());
            entry.setTotalScore(event.getScore());
            int attemps = entry.getProblemAttempts().get(event.getProblem());
            penalty += attemps * 10 + solve_time;
            entry.setPenalty(penalty);
        } else {
            penalty += (old_attemps + 1) * 10;
            if (entry.getProblemSolveTimes().containsKey(event.getProblem())) {
                penalty += entry.getProblemSolveTimes().get(event.getProblem());
            }
            entry.setPenalty(penalty);
        }

        leaderboard.put(event.getAuthor(), entry);

        List<LeaderboardEntry> sortedEntries = recalculate_ranks();

        ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String json = mapper.writeValueAsString(new LeaderboardUpdate(event.getContest(), sortedEntries));
        out.collect(new VirtualLeaderboardUpdateSerializable(event.getVirtualContest(), json));
    }
}
