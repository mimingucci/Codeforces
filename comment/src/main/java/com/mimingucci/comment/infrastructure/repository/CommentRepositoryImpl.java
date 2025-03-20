package com.mimingucci.comment.infrastructure.repository;

import com.mimingucci.comment.common.constant.ErrorMessageConstants;
import com.mimingucci.comment.common.exception.ApiRequestException;
import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.domain.repository.CommentRepository;
import com.mimingucci.comment.infrastructure.repository.converter.CommentConverter;
import com.mimingucci.comment.infrastructure.repository.entity.CommentEntity;
import com.mimingucci.comment.infrastructure.repository.jpa.CommentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepository {
    private final CommentJpaRepository commentJpaRepository;

    private final CommentConverter converter;

    @Override
    public Comment createComment(Comment domain) {
        CommentEntity entity = this.converter.toEntity(domain);
        return this.converter.toDomain(this.commentJpaRepository.save(entity));
    }

    @Override
    public Comment updateComment(Comment domain) {
        Optional<CommentEntity> optional = this.commentJpaRepository.findById(domain.getId());
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        CommentEntity entity = optional.get();
        if (entity.getAuthor().equals(domain.getAuthor())) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.CONFLICT);
        entity.setContent(domain.getContent());
        return this.converter.toDomain(this.commentJpaRepository.save(entity));
    }

    @Override
    public Boolean deleteComment(Long id) {
        boolean commentExists = this.commentJpaRepository.existsById(id);
        if (!commentExists) throw new ApiRequestException(ErrorMessageConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        this.commentJpaRepository.deleteById(id);
        return true;
    }

    @Override
    public Comment findById(Long id) {
        Optional<CommentEntity> optional = this.commentJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        return this.converter.toDomain(optional.get());
    }

    @Override
    public List<Comment> findByBlogId(Long blogId) {
        List<CommentEntity> entities = this.commentJpaRepository.findAllByBlogId(blogId);
        return entities.stream().map(this.converter::toDomain).toList();
    }

    @Override
    public List<Comment> findByUserId(Long userId) {
        List<CommentEntity> entities = this.commentJpaRepository.findAllByUserId(userId);
        return entities.stream().map(this.converter::toDomain).toList();
    }
}
