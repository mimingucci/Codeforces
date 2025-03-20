package com.mimingucci.blog.infrastructure.repository;

import com.mimingucci.blog.common.constant.ErrorMessageConstants;
import com.mimingucci.blog.common.exception.ApiRequestException;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.infrastructure.repository.converter.BlogConverter;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import com.mimingucci.blog.infrastructure.repository.jpa.BlogJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlogRepositoryImpl implements BlogRepository {

    private final BlogJpaRepository blogJpaRepository;

    private final BlogConverter converter;

    @Override
    public Blog findById(Long id) {
        Optional<BlogEntity> entity = this.blogJpaRepository.findById(id);
        if (entity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.BLOG_NOT_FOUND, HttpStatus.NOT_FOUND);
        return this.converter.toDomain(entity.get());
    }

    @Override
    public Blog createBlog(Blog blog) {
        BlogEntity entity = this.converter.toEntity(blog);
        return this.converter.toDomain(this.blogJpaRepository.save(entity));
    }

    @Override
    public Blog updateBlog(Blog blog) {
        return null;
    }

    @Override
    public Boolean deleteBlog(Long id) {
        return null;
    }
}
