package com.mimingucci.submission.domain.broker.producer.impl;

import com.mimingucci.submission.common.constant.KafkaTopicConstants;
import com.mimingucci.submission.domain.broker.producer.JudgeSubmissionProducer;
import com.mimingucci.submission.domain.event.JudgeSubmissionEvent;
import com.mimingucci.submission.domain.event.JudgeVirtualSubmissionEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JudgeSubmissionProducerImpl implements JudgeSubmissionProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendSubmissionToJudge(JudgeSubmissionEvent event) {
        kafkaTemplate.send(KafkaTopicConstants.JUDGE_SUBMISSION, event);
    }

    @Override
    public void sendVirtualSubmissionToJudge(JudgeVirtualSubmissionEvent event) {
        kafkaTemplate.send(KafkaTopicConstants.JUDGE_VIRTUAL_SUBMISSION, event);
    }
}
