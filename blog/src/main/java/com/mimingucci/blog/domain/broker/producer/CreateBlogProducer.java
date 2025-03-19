package com.mimingucci.blog.domain.broker.producer;

import com.mimingucci.blog.domain.event.BlogAddAuthorEvent;

public interface CreateBlogProducer {
    void sendUserAddBlogEvent(BlogAddAuthorEvent event);
}
