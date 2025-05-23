package com.mimingucci.comment.infrastructure.repository.converter;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.infrastructure.repository.entity.CommentEntity;
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
public class CommentConverterImpl implements CommentConverter {

    @Override
    public CommentEntity toEntity(Comment domain) {
        if ( domain == null ) {
            return null;
        }

        CommentEntity commentEntity = new CommentEntity();

        commentEntity.setId( domain.getId() );
        commentEntity.setContent( domain.getContent() );
        commentEntity.setAuthor( domain.getAuthor() );
        commentEntity.setBlog( domain.getBlog() );
        Set<Long> set = domain.getLikes();
        if ( set != null ) {
            commentEntity.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getDislikes();
        if ( set1 != null ) {
            commentEntity.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }
        commentEntity.setCreatedAt( domain.getCreatedAt() );
        commentEntity.setUpdatedAt( domain.getUpdatedAt() );

        return commentEntity;
    }

    @Override
    public Comment toDomain(CommentEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Comment comment = new Comment();

        comment.setId( entity.getId() );
        comment.setContent( entity.getContent() );
        comment.setAuthor( entity.getAuthor() );
        comment.setBlog( entity.getBlog() );
        comment.setCreatedAt( entity.getCreatedAt() );
        comment.setUpdatedAt( entity.getUpdatedAt() );
        Set<Long> set = entity.getLikes();
        if ( set != null ) {
            comment.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = entity.getDislikes();
        if ( set1 != null ) {
            comment.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }

        return comment;
    }
}
