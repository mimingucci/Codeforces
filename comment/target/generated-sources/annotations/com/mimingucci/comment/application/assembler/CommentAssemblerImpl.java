package com.mimingucci.comment.application.assembler;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:30:47+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class CommentAssemblerImpl implements CommentAssembler {

    @Override
    public Comment createToDomain(CommentCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Comment comment = new Comment();

        comment.setContent( request.getContent() );
        comment.setBlog( request.getBlog() );

        return comment;
    }

    @Override
    public CommentResponse domainToResponse(Comment domain) {
        if ( domain == null ) {
            return null;
        }

        CommentResponse commentResponse = new CommentResponse();

        commentResponse.setId( domain.getId() );
        commentResponse.setContent( domain.getContent() );
        commentResponse.setAuthor( domain.getAuthor() );
        commentResponse.setBlog( domain.getBlog() );
        commentResponse.setCreatedAt( domain.getCreatedAt() );
        commentResponse.setUpdatedAt( domain.getUpdatedAt() );
        Set<Long> set = domain.getLikes();
        if ( set != null ) {
            commentResponse.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getDislikes();
        if ( set1 != null ) {
            commentResponse.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }

        return commentResponse;
    }

    @Override
    public Comment updateToDomain(CommentUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        Comment comment = new Comment();

        comment.setContent( request.getContent() );

        return comment;
    }
}
