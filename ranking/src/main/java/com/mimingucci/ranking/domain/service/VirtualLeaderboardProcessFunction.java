package com.mimingucci.ranking.domain.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.model.*;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import org.apache.flink.api.common.state.*;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.co.KeyedBroadcastProcessFunction;
import org.apache.flink.util.Collector;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class VirtualLeaderboardProcessFunction extends KeyedBroadcastProcessFunction<String, SubmissionResultEvent, VirtualContestMetadata, VirtualLeaderboardUpdateSerializable> {

    private transient MapState<String, LeaderboardEntry> leaderboard;
    private transient ValueState<Boolean> contestFinished;
    private final MapStateDescriptor<String, VirtualContestMetadata> metadataDescriptor;

    public VirtualLeaderboardProcessFunction(
            MapStateDescriptor<String, VirtualContestMetadata> metadataDescriptor,
            LeaderboardEntryRepository leaderboardEntryRepository) {
        this.metadataDescriptor = metadataDescriptor;
    }

    @Override
    public void open(Configuration parameters) {
        MapStateDescriptor<String, LeaderboardEntry> desc =
                new MapStateDescriptor<>("virtualLeaderboardState", String.class, LeaderboardEntry.class);
        leaderboard = getRuntimeContext().getMapState(desc);

        ValueStateDescriptor<Boolean> finishedDesc =
                new ValueStateDescriptor<>("contestFinished", Boolean.class);
        contestFinished = getRuntimeContext().getState(finishedDesc);
    }

    public List<LeaderboardEntry> recalculateRanks() throws Exception {
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
                entry.setRank(currentRank);
            } else {
                currentRank = actualIndex;
                entry.setRank(currentRank);
            }
            actualIndex++;
            prev = entry;
        }

        return sortedEntries;
    }

    @Override
    public void processElement(SubmissionResultEvent event, ReadOnlyContext ctx, Collector<VirtualLeaderboardUpdateSerializable> out) throws Exception {
        Boolean isFinished = contestFinished.value();
        if (isFinished != null && isFinished) {
            // Contest is already finished - don't process any more events
            return;
        }

        ReadOnlyBroadcastState<String, VirtualContestMetadata> metadataState = ctx.getBroadcastState(metadataDescriptor);
        VirtualContestMetadata metadata = metadataState.get(event.getContest() + "-" + event.getAuthor());

        if (metadata == null) {
            // Metadata not available yet, skip
            return;
        }

        // Validate submission time
        if (event.getJudged_on().isBefore(metadata.getStartTime()) || event.getJudged_on().isAfter(metadata.getEndTime())) {
            return;
        }

        LeaderboardEntry entry = leaderboard.get(event.getContest() + "-" + event.getAuthor());
        if (entry == null) {
            entry = new LeaderboardEntry();
            entry.setUserId(event.getAuthor());
            entry.setContestId(event.getContest());
        }

        if (!entry.getProblemAttempts().containsKey(event.getProblem())) {
            entry.getProblemAttempts().put(event.getProblem(), 0);
        }

        int oldPenalty = entry.getPenalty();
        int oldAttempts = entry.getProblemAttempts().get(event.getProblem());
        int penalty = oldPenalty - oldAttempts * 10;
        if (entry.getProblemSolveTimes().containsKey(event.getProblem())) {
            penalty -= entry.getProblemSolveTimes().get(event.getProblem());
        }

        entry.getProblemAttempts().compute(event.getProblem(), (k, attempt) -> attempt + 1);

        if (event.getVerdict().equals(SubmissionVerdict.ACCEPT)) {
            if (!entry.getSolvedProblems().contains(event.getProblem())) {
                entry.getSolvedProblems().add(event.getProblem());

                int solveTime = (int) Duration.between(metadata.getStartTime(), event.getJudged_on()).toMinutes();
                entry.getProblemSolveTimes().put(event.getProblem(), solveTime);

                entry.setTotalScore(entry.getTotalScore() + event.getScore());
                int attempts = entry.getProblemAttempts().get(event.getProblem());
                penalty += (attempts - 1) * 10 + solveTime;  // -1 because we don't count the successful attempt
                entry.setPenalty(penalty);
            }
        }

        leaderboard.put(event.getContest() + "-" + event.getAuthor(), entry);

        List<LeaderboardEntry> sortedEntries = recalculateRanks();

        ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String json = mapper.writeValueAsString(new LeaderboardUpdate(event.getContest(), sortedEntries));
        out.collect(new VirtualLeaderboardUpdateSerializable(event.getContest(), event.getAuthor(), json));
    }

    @Override
    public void processBroadcastElement(VirtualContestMetadata metadata, Context ctx, Collector<VirtualLeaderboardUpdateSerializable> out) throws Exception {
        BroadcastState<String, VirtualContestMetadata> state = ctx.getBroadcastState(metadataDescriptor);
        state.put(metadata.getContestId() + "-" + metadata.getUserId(), metadata);

        // If the end time of the contest has passed, finalize the leaderboard
        if (metadata.getEndTime() != null && Instant.now().isAfter(metadata.getEndTime())) {
            contestFinished.update(true);

            List<LeaderboardEntry> sortedEntries = recalculateRanks();

            ObjectMapper mapper = new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            String json = mapper.writeValueAsString(new LeaderboardUpdate(metadata.getContestId(), sortedEntries));
            out.collect(new VirtualLeaderboardUpdateSerializable(metadata.getContestId(), metadata.getUserId(), json));

            // Clear state
            leaderboard.clear();
        }
    }
}
