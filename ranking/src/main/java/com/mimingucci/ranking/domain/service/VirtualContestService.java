package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.common.enums.SubmissionType;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.event.VirtualSubmissionResultEvent;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class VirtualContestService {
    private final SubmissionResultRepository submissionResultRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void scheduleVirtualContest(VirtualContestMetadata virtualContest) {
        // Schedule contest start, end
        VirtualSubmissionResultEvent startEvent = new VirtualSubmissionResultEvent();
        startEvent.setEventType(SubmissionType.CONTEST_STARTED);
        startEvent.setVirtualContest(virtualContest.getId());
        startEvent.setContest(virtualContest.getContest());
        startEvent.setContestants(virtualContest.getContestants());
        startEvent.setProblemset(virtualContest.getProblemset());
        startEvent.setStartTime(virtualContest.getStartTime());
        startEvent.setEndTime(virtualContest.getEndTime());
        startEvent.setActualStartTime(virtualContest.getActualStartTime());
        startEvent.setActualEndTime(virtualContest.getActualEndTime());
        long contestStartDelayMillis = Duration.between(Instant.now(), virtualContest.getStartTime()).toMillis();
        scheduler.schedule(() -> {
            // Send contest start event
            kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, startEvent);
        }, contestStartDelayMillis, TimeUnit.MILLISECONDS);

        VirtualSubmissionResultEvent endEvent = new VirtualSubmissionResultEvent();
        endEvent.setEventType(SubmissionType.CONTEST_ENDED);
        endEvent.setVirtualContest(virtualContest.getId());
        endEvent.setContest(virtualContest.getContest());
        endEvent.setStartTime(virtualContest.getStartTime());
        endEvent.setEndTime(virtualContest.getEndTime());
        endEvent.setActualStartTime(virtualContest.getActualStartTime());
        endEvent.setActualEndTime(virtualContest.getActualEndTime());
        long contestEndDelayMillis = Duration.between(Instant.now(), virtualContest.getEndTime()).toMillis();
        scheduler.schedule(() -> {
            // Send contest end event
            kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, endEvent);
        }, contestEndDelayMillis, TimeUnit.MILLISECONDS);

        // Then, schedule submission events based on their original timing
        List<SubmissionResultEvent> originalSubmissions =
                submissionResultRepository.findByContestId(virtualContest.getContest());

        for (SubmissionResultEvent submission : originalSubmissions) {
            try {
                // ignore owner's submission
                if (submission.getAuthor().equals(virtualContest.getUser())) continue;

                VirtualSubmissionResultEvent virtualSubmission = new VirtualSubmissionResultEvent();
                virtualSubmission.setId(submission.getId());
                virtualSubmission.setContest(virtualContest.getContest());
                virtualSubmission.setVirtualContest(virtualContest.getId());
                virtualSubmission.setActualStartTime(virtualContest.getActualStartTime());
                virtualSubmission.setActualEndTime(virtualContest.getActualEndTime());
                virtualSubmission.setStartTime(virtualContest.getStartTime());
                virtualSubmission.setEndTime(virtualContest.getEndTime());
                virtualSubmission.setAuthor(submission.getAuthor());
                virtualSubmission.setProblem(submission.getProblem());
                virtualSubmission.setEventType(SubmissionType.SUBMISSION);
                virtualSubmission.setVerdict(submission.getVerdict());
                virtualSubmission.setScore(submission.getScore());

                // Calculate the offset from contest start
                Duration offset = Duration.between(virtualContest.getActualStartTime(), submission.getJudged_on());

                // Schedule this submission at the appropriate virtual time
                Instant virtualJudgeTime = virtualContest.getStartTime().plus(offset);

                virtualSubmission.setJudged_on(virtualJudgeTime);

                // Calculate the offset from contest start
                Duration offset1 = Duration.between(virtualContest.getActualStartTime(), submission.getSent_on());

                // Schedule this submission at the appropriate virtual time
                Instant virtualJudgeTime1 = virtualContest.getStartTime().plus(offset1);

                virtualSubmission.setSent_on(virtualJudgeTime1);

                // Schedule the event
                long delayMillis = Duration.between(Instant.now(), virtualJudgeTime).toMillis();
                log.info("Delayed: " + delayMillis/1000);
                if (delayMillis > 0) {
                    scheduler.schedule(() ->
                                    kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, virtualSubmission),
                            delayMillis, TimeUnit.MILLISECONDS);
                } else {
                    // If the time has already passed, send immediately
                    kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, virtualSubmission);
                }
            } catch (Exception e) {
                log.warn("Skipping submission {} due to error: {}", submission.getId(), e.getMessage());
                // Optionally log the stack trace for debugging:
                // log.debug("Stack trace:", e);
            }
        }
    }
}
