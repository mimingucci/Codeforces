package com.mimingucci.blog.domain.service.impl;

import com.mimingucci.blog.domain.broker.producer.CreateBlogProducer;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.domain.service.BlogService;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    private final CreateBlogProducer blogProducer;

    @Override
    public Blog createBlog(Blog domain) {
        return this.blogRepository.createBlog(domain);
    }

    @Override
    public Blog findBlogById(Long id) {
        return this.blogRepository.findById(id);
    }

    @Override
    public List<Blog> findByTag(String tagName) {
        return this.blogRepository.findByTag(tagName);
    }

    @Override
    public Boolean deleteById(Long id, Long author) {
        return this.blogRepository.deleteBlog(id, author);
    }

    @Override
    public Page<Blog> getAll(Pageable pageable) {
        return this.blogRepository.findAll(pageable);
    }

    @Override
    public Page<Blog> getAllByUserId(Long userId, Pageable pageable) {
        return this.blogRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public Blog updateById(Blog blog) {
        return this.blogRepository.updateBlog(blog);
    }

    @Override
    public Blog likeBlog(Long blogId, Long userId) {
        return this.blogRepository.likeBlog(blogId, userId);
    }

    @Override
    public Blog dislikeBlog(Long blogId, Long userId) {
        return this.blogRepository.dislikeBlog(blogId, userId);
    }
}
