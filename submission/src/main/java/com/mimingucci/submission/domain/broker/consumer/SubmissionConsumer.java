package com.mimingucci.submission.domain.broker.consumer;

import com.mimingucci.submission.common.constant.KafkaTopicConstants;
import com.mimingucci.submission.domain.event.SubmissionJudgedEvent;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.service.SubmissionService;
import com.mimingucci.submission.presentation.dto.response.SubmissionUpdateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubmissionConsumer {
    private final SubmissionService service;

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = KafkaTopicConstants.UPDATE_SUBMISSION_VERDICT, groupId = "${spring.kafka.consumer.group-id}")
    public void submissionUpdateListener(SubmissionJudgedEvent event) {
        System.out.println("Listening...");
        Submission submission = new Submission();
        submission.setVerdict(event.getVerdict());
        submission.setId(event.getId());
        submission.setExecution_time_ms(event.getExecution_time_ms());
        submission.setMemory_used_bytes(event.getMemory_used_bytes());
        submission.setJudged(event.getJudged_on());
        service.updateSubmission(event.getId(), submission);

        // Send WebSocket notification
        SubmissionUpdateResponse updateDTO = SubmissionUpdateResponse.builder()
                .id(event.getId())
                .verdict(event.getVerdict())
                .executionTimeMs(event.getExecution_time_ms())
                .memoryUsedBytes(event.getMemory_used_bytes())
                .build();

        // Send to specific submission topic
        messagingTemplate.convertAndSend(
                "/topic/submission/" + event.getId(),
                updateDTO
        );
    }
}
