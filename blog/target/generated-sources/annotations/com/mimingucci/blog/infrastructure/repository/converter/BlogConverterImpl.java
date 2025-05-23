package com.mimingucci.blog.infrastructure.repository.converter;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:23:20+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class BlogConverterImpl implements BlogConverter {

    @Override
    public BlogEntity toEntity(Blog domain) {
        if ( domain == null ) {
            return null;
        }

        BlogEntity blogEntity = new BlogEntity();

        blogEntity.setId( domain.getId() );
        blogEntity.setTitle( domain.getTitle() );
        blogEntity.setContent( domain.getContent() );
        blogEntity.setAuthor( domain.getAuthor() );
        blogEntity.setCreatedAt( domain.getCreatedAt() );
        blogEntity.setUpdatedAt( domain.getUpdatedAt() );
        Set<Long> set = domain.getLikes();
        if ( set != null ) {
            blogEntity.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getDislikes();
        if ( set1 != null ) {
            blogEntity.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }

        mapTags( blogEntity, domain );

        return blogEntity;
    }

    @Override
    public Blog toDomain(BlogEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Blog blog = new Blog();

        blog.setId( entity.getId() );
        blog.setTitle( entity.getTitle() );
        blog.setContent( entity.getContent() );
        blog.setAuthor( entity.getAuthor() );
        Set<Long> set = entity.getLikes();
        if ( set != null ) {
            blog.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = entity.getDislikes();
        if ( set1 != null ) {
            blog.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }
        blog.setCreatedAt( entity.getCreatedAt() );
        blog.setUpdatedAt( entity.getUpdatedAt() );

        blog.setTags( mapTagsToStrings(entity) );

        return blog;
    }
}
