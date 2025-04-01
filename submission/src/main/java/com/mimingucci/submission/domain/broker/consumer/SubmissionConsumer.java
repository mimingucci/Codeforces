package com.mimingucci.submission.domain.broker.consumer;

import com.mimingucci.submission.common.constant.KafkaTopicConstants;
import com.mimingucci.submission.domain.event.SubmissionJudgedEvent;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubmissionConsumer {
    private final SubmissionService service;

    @KafkaListener(topics = KafkaTopicConstants.UPDATE_SUBMISSION_VERDICT, groupId = "${spring.kafka.consumer.group-id}")
    public void submissionUpdateListener(SubmissionJudgedEvent event) {
        Submission submission = new Submission();
        submission.setVerdict(event.getVerdict());
        submission.setId(event.getId());
        service.updateSubmission(event.getId(), submission);
    }
}
