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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogRepositoryImpl implements BlogRepository {

    private final BlogJpaRepository blogJpaRepository;

    @Override
    public Blog findById(Long id) {
        Optional<BlogEntity> entity = this.blogJpaRepository.findById(id);
        if (entity.isEmpty()) {
            throw new ApiRequestException(ErrorMessageConstants.BLOG_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return BlogConverter.INSTANCE.toDomain(entity.get());
    }

    @Override
    public Blog createBlog(Blog blog) {
        BlogEntity entity = BlogConverter.INSTANCE.toEntity(blog);
        entity.setId(IdGenerator.INSTANCE.nextId());

        return BlogConverter.INSTANCE.toDomain(this.blogJpaRepository.save(entity));

    }

    @Override
    @Transactional
    public Blog updateBlog(Blog blog) {
        BlogEntity existingEntity = this.blogJpaRepository.findById(blog.getId())
                .orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.BLOG_NOT_FOUND, HttpStatus.NOT_FOUND));

        if (!existingEntity.getAuthor().equals(blog.getAuthor())) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        // Update basic fields
        existingEntity.setTitle(blog.getTitle());
        existingEntity.setContent(blog.getContent());

        return BlogConverter.INSTANCE.toDomain(this.blogJpaRepository.save(existingEntity));
    }

    @Transactional
    @Override
    public Boolean deleteBlog(Long id, Long author) {
        // Validate blog exists
        BlogEntity blogEntity = this.blogJpaRepository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.BLOG_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        if (!blogEntity.getAuthor().equals(author)) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);

        // Remove blog-tag associations
        blogEntity.getTags().clear();

        // Delete the blog
        this.blogJpaRepository.delete(blogEntity);

        return true;
    }

    @Override
    public Page<Blog> findByAuthor(Long authorId, Pageable pageable) {
        return this.blogJpaRepository.findByAuthorOrderByCreatedAtDesc(authorId, pageable)
                .map(BlogConverter.INSTANCE::toDomain);
    }

    @Override
    public List<Blog> findByTag(String tagName) {
        return null;
    }

    @Override
    public Page<Blog> searchBlogs(String query, Pageable pageable) {
        return this.blogJpaRepository.searchBlogs(query, pageable)
                .map(BlogConverter.INSTANCE::toDomain);
    }

    @Override
    public List<Blog> findRecentBlogsByTag(String tagName, Instant since) {
        return null;
    }

    @Override
    public Page<Blog> findTrendingBlogs(Pageable pageable) {
        return this.blogJpaRepository.findTrendingBlogs(pageable)
                .map(BlogConverter.INSTANCE::toDomain);
    }

    @Override
    public Page<Blog> findAll(Pageable pageable) {
        return this.blogJpaRepository.findNewestBlogs(pageable).map(BlogConverter.INSTANCE::toDomain);
    }

    @Override
    public Page<Blog> findAllByUserId(Long userId, Pageable pageable) {
        return this.blogJpaRepository.findNewestBlogsByAuthor(userId, pageable).map(BlogConverter.INSTANCE::toDomain);
    }

    @Override
    public Blog likeBlog(Long blogId, Long userId) {
        // Validate blog exists
        BlogEntity blogEntity = this.blogJpaRepository.findById(blogId)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.BLOG_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        if (!blogEntity.getLikes().contains(userId)) blogEntity.addLike(userId);
        else blogEntity.getLikes().remove(userId);
        return BlogConverter.INSTANCE.toDomain(this.blogJpaRepository.save(blogEntity));
    }

    @Override
    public Blog dislikeBlog(Long blogId, Long userId) {
        // Validate blog exists
        BlogEntity blogEntity = this.blogJpaRepository.findById(blogId)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.BLOG_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        if (!blogEntity.getDislikes().contains(userId)) blogEntity.addDislike(userId);
        else blogEntity.getDislikes().remove(userId);
        return BlogConverter.INSTANCE.toDomain(this.blogJpaRepository.save(blogEntity));
    }
}
