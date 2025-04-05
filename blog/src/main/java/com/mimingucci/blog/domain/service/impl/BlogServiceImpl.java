package com.mimingucci.blog.domain.service.impl;

import com.mimingucci.blog.domain.broker.producer.CreateBlogProducer;
import com.mimingucci.blog.domain.event.BlogAddAuthorEvent;
import com.mimingucci.blog.domain.event.BlogAddTagEvent;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.domain.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    private final CreateBlogProducer blogProducer;

    @Override
    public Blog createBlog(Blog domain) {
        Blog blog = this.blogRepository.createBlog(domain);
        // send events to broker
//        this.blogProducer.sendUserAddBlogEvent(BlogAddAuthorEvent.builder().userId(domain.getAuthor()).blogId(domain.getId()).build());
//        this.blogProducer.sendBlogAddTagEvent(BlogAddTagEvent.builder().tagIds(domain.getTags()).build());
        return blog;
    }

    @Override
    public Blog findBlogById(Long id) {
        return this.blogRepository.findById(id);
    }
}
