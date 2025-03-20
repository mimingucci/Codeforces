package com.mimingucci.blog.infrastructure.broker.producer;

import com.mimingucci.blog.common.constant.KafkaTopicConstants;
import com.mimingucci.blog.domain.broker.producer.CreateBlogProducer;
import com.mimingucci.blog.domain.event.BlogAddAuthorEvent;
import com.mimingucci.blog.domain.event.BlogAddTagEvent;
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

    @Override
    public void sendBlogAddTagEvent(BlogAddTagEvent event) {
        kafkaTemplate.send(KafkaTopicConstants.ADD_TAGS_FOR_BLOG, event);
    }
}
