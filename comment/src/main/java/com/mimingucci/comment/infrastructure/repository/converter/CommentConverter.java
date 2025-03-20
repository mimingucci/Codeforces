package com.mimingucci.comment.infrastructure.repository.converter;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.infrastructure.repository.entity.CommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentConverter {
    CommentConverter INSTANCE = Mappers.getMapper(CommentConverter.class);

    CommentEntity toEntity(Comment domain);

    Comment toDomain(CommentEntity entity);
}
