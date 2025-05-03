package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.common.enums.SubmissionType;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.event.VirtualSubmissionResultEvent;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VirtualContestService {
    private final SubmissionResultRepository submissionResultRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void scheduleVirtualContest(VirtualContestMetadata virtualContest) {
//        // Schedule contest start, end
//        VirtualSubmissionResultEvent startEvent = new VirtualSubmissionResultEvent();
//        startEvent.setEventType(SubmissionType.CONTEST_STARTED);
//        startEvent.setContest(virtualContest.getContestId());
//        startEvent.setContestants(virtualContest.getContestants());
//        startEvent.setProblemset(virtualContest.getProblemset());
//        startEvent.setStartTime(virtualContest.getStartTime());
//        startEvent.setEndTime(virtualContest.getEndTime());
//        long contestStartDelayMillis = Duration.between(Instant.now(), virtualContest.getStartTime()).toMillis();
//        scheduler.schedule(() -> {
//            // Send contest start event
//            kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, startEvent);
//        }, contestStartDelayMillis, TimeUnit.MILLISECONDS);
//
//        VirtualSubmissionResultEvent endEvent = new VirtualSubmissionResultEvent();
//        endEvent.setEventType(SubmissionType.CONTEST_ENDED);
//        endEvent.setContest(virtualContest.getContestId());
//        endEvent.setStartTime(virtualContest.getStartTime());
//        endEvent.setEndTime(virtualContest.getEndTime());
//        long contestEndDelayMillis = Duration.between(Instant.now(), virtualContest.getEndTime()).toMillis();
//        scheduler.schedule(() -> {
//            // Send contest end event
//            kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, endEvent);
//        }, contestEndDelayMillis, TimeUnit.MILLISECONDS);
//
//        // Then, schedule submission events based on their original timing
//        List<SubmissionResultEvent> originalSubmissions =
//                submissionResultRepository.findByContestId(virtualContest.getContestId());
//
//        for (SubmissionResultEvent submission : originalSubmissions) {
//            // ignore owner's submission
//            if (submission.getAuthor().equals(virtualContest.getUserId())) continue;
//            // Calculate the offset from contest start
//            Duration offset = Duration.between(virtualContest.getActualStartTime(), submission.getJudged_on());
//
//            // Schedule this submission at the appropriate virtual time
//            Instant virtualJudgeTime = virtualContest.getStartTime().plus(offset);
//
//            submission.setJudged_on(virtualJudgeTime);
//
//            // Calculate the offset from contest start
//            Duration offset1 = Duration.between(virtualContest.getActualStartTime(), submission.getSent_on());
//
//            // Schedule this submission at the appropriate virtual time
//            Instant virtualJudgeTime1 = virtualContest.getStartTime().plus(offset1);
//
//            submission.setSent_on(virtualJudgeTime1);
//
//            // Schedule the event
//            long delayMillis = Duration.between(Instant.now(), virtualJudgeTime).toMillis();
//            if (delayMillis > 0) {
//                scheduler.schedule(() ->
//                                kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, submission),
//                        delayMillis, TimeUnit.MILLISECONDS);
//            } else {
//                // If the time has already passed, send immediately
//                kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, submission);
//            }
//        }
    }
}
