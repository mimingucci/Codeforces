package com.mimingucci.blog.infrastructure.repository;

import com.mimingucci.blog.common.constant.ErrorMessageConstants;
import com.mimingucci.blog.common.exception.ApiRequestException;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.infrastructure.repository.converter.BlogConverter;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import com.mimingucci.blog.infrastructure.repository.jpa.BlogJpaRepository;
import com.mimingucci.blog.infrastructure.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlogRepositoryImpl implements BlogRepository {

    private final BlogJpaRepository blogJpaRepository;

    @Override
    public Blog findById(Long id) {
        Optional<BlogEntity> entity = this.blogJpaRepository.findById(id);
        if (entity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.BLOG_NOT_FOUND, HttpStatus.NOT_FOUND);
        return BlogConverter.INSTANCE.toDomain(entity.get());
    }

    @Override
    public Blog createBlog(Blog blog) {
        System.out.println(blog.getContent());
        BlogEntity entity = BlogConverter.INSTANCE.toEntity(blog);
        entity.setId(IdGenerator.INSTANCE.nextId());
        System.out.println(entity.getContent());
        return BlogConverter.INSTANCE.toDomain(this.blogJpaRepository.save(entity));
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
