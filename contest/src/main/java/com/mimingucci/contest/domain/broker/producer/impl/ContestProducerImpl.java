package com.mimingucci.contest.domain.broker.producer.impl;

import com.mimingucci.contest.common.constant.KafkaTopicConstants;
import com.mimingucci.contest.domain.broker.producer.ContestProducer;
import com.mimingucci.contest.domain.event.ContestActionEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContestProducerImpl implements ContestProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendContestActionEvent(ContestActionEvent event) {
        kafkaTemplate.send(KafkaTopicConstants.CONTEST_ACTION, event);
    }
}
