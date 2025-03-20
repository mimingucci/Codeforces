package com.mimingucci.comment.application.assembler;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.infrastructure.util.IdGenerator;
import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class CommentAssembler {
    public Comment createRequestToDomain(CommentCreateRequest request) {
        Comment comment = this.createToDomain(request);
        comment.setId(IdGenerator.INSTANCE.nextId());
        return comment;
    }

    public List<CommentResponse> listToResponse(List<Comment> comments) {
        return comments.stream().map(this::domainToResponse).toList();
    }

    public abstract Comment createToDomain(CommentCreateRequest request);

    public abstract CommentResponse domainToResponse(Comment domain);

    public abstract Comment updateToDomain(CommentUpdateRequest request);
}
