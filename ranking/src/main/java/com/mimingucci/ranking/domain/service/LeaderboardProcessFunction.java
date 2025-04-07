package com.mimingucci.ranking.domain.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.model.ContestMetadata;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.LeaderboardUpdate;
import com.mimingucci.ranking.domain.model.LeaderboardUpdateSerializable;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import org.apache.flink.api.common.state.*;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.co.KeyedBroadcastProcessFunction;
import org.apache.flink.util.Collector;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

public class LeaderboardProcessFunction extends KeyedBroadcastProcessFunction<Long, SubmissionResultEvent, ContestMetadata, LeaderboardUpdateSerializable> {

    private transient MapState<Long, LeaderboardEntry> leaderboard;

    private transient ListState<SubmissionResultEvent> submissionHistory;

    private final MapStateDescriptor<Long, ContestMetadata> metadataDescriptor;

    private transient LeaderboardEntryRepository leaderboardEntryRepository;

    private transient SubmissionResultRepository submissionResultRepository;

    public LeaderboardProcessFunction(MapStateDescriptor<Long, ContestMetadata> metadataDescriptor, LeaderboardEntryRepository leaderboardEntryRepository, SubmissionResultRepository submissionResultRepository) {
        this.metadataDescriptor = metadataDescriptor;
        this.leaderboardEntryRepository = leaderboardEntryRepository;
        this.submissionResultRepository = submissionResultRepository;
    }

    @Override
    public void open(Configuration parameters) {
        MapStateDescriptor<Long, LeaderboardEntry> desc =
                new MapStateDescriptor<>("leaderboardState", Long.class, LeaderboardEntry.class);
        leaderboard = getRuntimeContext().getMapState(desc);
        ListStateDescriptor<SubmissionResultEvent> events =
                new ListStateDescriptor<>("submissionHistory", SubmissionResultEvent.class);
        submissionHistory = getRuntimeContext().getListState(events);
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
    public void processElement(SubmissionResultEvent event, ReadOnlyContext ctx, Collector<LeaderboardUpdateSerializable> out) throws Exception {
        ReadOnlyBroadcastState<Long, ContestMetadata> metadataState = ctx.getBroadcastState(metadataDescriptor);
        ContestMetadata metadata = metadataState.get(event.getContest());

        if (metadata == null) {
            // Metadata not available yet, skip or buffer if needed
            return;
        }

        if (metadata.getStartTime() != null && event.getJudged_on().isBefore(metadata.getStartTime())) return;
        if (metadata.getEndTime() != null && event.getJudged_on().isAfter(metadata.getEndTime())) return;

        submissionHistory.add(event);

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
            int solve_time = (int) Duration.between(event.getJudged_on(), metadata.getStartTime()).toMinutes();
            entry.getProblemSolveTimes().put(event.getProblem(), solve_time);

            entry.setTotalScore(event.getScore());
            int attemps = entry.getProblemAttempts().get(event.getProblem());
            penalty += attemps * 10 + solve_time;
            entry.setPenalty(penalty);
        } else {
            penalty += (old_attemps + 1) * 10 + entry.getProblemSolveTimes().get(event.getProblem());
            entry.setPenalty(penalty);
        }

        leaderboard.put(event.getAuthor(), entry);

        List<LeaderboardEntry> sortedEntries = recalculate_ranks();

        ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String json = mapper.writeValueAsString(new LeaderboardUpdate(event.getContest(), sortedEntries));
        out.collect(new LeaderboardUpdateSerializable(event.getContest(), json));
    }

    @Override
    public void processBroadcastElement(ContestMetadata metadata, Context ctx, Collector<LeaderboardUpdateSerializable> out) throws Exception {
        BroadcastState<Long, ContestMetadata> state = ctx.getBroadcastState(metadataDescriptor);
        state.put(metadata.getId(), metadata);
        if (metadata.getEndTime() != null && Instant.now().isAfter(metadata.getEndTime())) {
            // contest is over
            List<LeaderboardEntry> sortedEntries = recalculate_ranks();

            ObjectMapper mapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            String json = mapper.writeValueAsString(new LeaderboardUpdate(metadata.getId(), sortedEntries));
            out.collect(new LeaderboardUpdateSerializable(metadata.getId(), json));

            List<LeaderboardEntry> entries = new ArrayList<>();
            for (var entry : this.leaderboard.values()) {
                if (Objects.equals(entry.getContestId(), metadata.getId())) entries.add(entry);
            }
            this.leaderboardEntryRepository.saveLeaderboardEntriesDuringContest(entries);

            List<SubmissionResultEvent> events = new ArrayList<>();
            for (var event : this.submissionHistory.get()) {
                if (Objects.equals(event.getContest(), metadata.getId())) events.add(event);
            }
            this.submissionResultRepository.saveSubmissionResultEventsDuringContest(events);

            submissionHistory.clear();
            leaderboard.clear();
        }
    }
}

