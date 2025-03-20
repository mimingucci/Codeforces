package com.mimingucci.blog.domain.broker.producer;

import com.mimingucci.blog.domain.event.BlogAddAuthorEvent;
import com.mimingucci.blog.domain.event.BlogAddTagEvent;

public interface CreateBlogProducer {
    void sendUserAddBlogEvent(BlogAddAuthorEvent event);

    void sendBlogAddTagEvent(BlogAddTagEvent event);
}
