package com.mimingucci.blog.infrastructure.broker.producer;

import com.mimingucci.blog.common.constant.KafkaTopicConstants;
import com.mimingucci.blog.domain.broker.producer.CreateBlogProducer;
import com.mimingucci.blog.domain.event.BlogAddAuthorEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateBlogProducerImpl implements CreateBlogProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendUserAddBlogEvent(BlogAddAuthorEvent event) {
        kafkaTemplate.send(KafkaTopicConstants.ADD_AUTHOR_FOR_BLOG, event);
    }
}
