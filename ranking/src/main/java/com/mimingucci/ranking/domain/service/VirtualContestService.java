package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
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
        // First, publish the contest metadata
        kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_CONTEST_ACTION, virtualContest);

        // Then, schedule submission events based on their original timing
        List<SubmissionResultEvent> originalSubmissions =
                submissionResultRepository.findByContestId(virtualContest.getContestId());

        for (SubmissionResultEvent submission : originalSubmissions) {

            // Calculate the offset from contest start
            Duration offset = Duration.between(virtualContest.getActualStartTime(), submission.getJudged_on());

            // Schedule this submission at the appropriate virtual time
            Instant virtualJudgeTime = virtualContest.getStartTime().plus(offset);

            submission.setJudged_on(virtualJudgeTime);

            // Schedule the event
            long delayMillis = Duration.between(Instant.now(), virtualJudgeTime).toMillis();
            if (delayMillis > 0) {
                scheduler.schedule(() ->
                                kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, submission),
                        delayMillis, TimeUnit.MILLISECONDS);
            } else {
                // If the time has already passed, send immediately
                kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT, submission);
            }
        }

        // Schedule contest end
        long contestEndDelayMillis = Duration.between(Instant.now(), virtualContest.getEndTime()).toMillis();
        scheduler.schedule(() -> {
            // Send contest end event
            kafkaTemplate.send(KafkaTopicConstants.VIRTUAL_CONTEST_ACTION, virtualContest);
        }, contestEndDelayMillis, TimeUnit.MILLISECONDS);
    }
}
