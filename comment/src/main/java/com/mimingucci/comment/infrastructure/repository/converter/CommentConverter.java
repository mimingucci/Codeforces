package com.mimingucci.comment.infrastructure.repository.converter;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.infrastructure.repository.entity.CommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentConverter {
    CommentConverter INSTANCE = Mappers.getMapper(CommentConverter.class);

    CommentEntity toEntity(Comment domain);

    Comment toDomain(CommentEntity entity);
}
