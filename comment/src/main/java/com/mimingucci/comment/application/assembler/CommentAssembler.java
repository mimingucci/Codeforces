package com.mimingucci.comment.application.assembler;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.infrastructure.util.IdGenerator;
import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CommentAssembler {
    CommentAssembler INSTANCE = Mappers.getMapper(CommentAssembler.class);

    default Comment createRequestToDomain(CommentCreateRequest request) {
        Comment comment = this.createToDomain(request);
        comment.setId(IdGenerator.INSTANCE.nextId());
        return comment;
    }

    default List<CommentResponse> listToResponse(List<Comment> comments) {
        return comments.stream().map(this::domainToResponse).toList();
    }

    Comment createToDomain(CommentCreateRequest request);

    CommentResponse domainToResponse(Comment domain);

    Comment updateToDomain(CommentUpdateRequest request);
}
