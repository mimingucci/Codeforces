package com.mimingucci.blog.application.assembler;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-06T11:47:51+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class BlogAssemblerImpl implements BlogAssembler {

    @Override
    public Blog createToDomain(BlogCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Blog blog = new Blog();

        blog.setTitle( request.getTitle() );
        blog.setContent( request.getContent() );
        List<String> list = request.getTags();
        if ( list != null ) {
            blog.setTags( new ArrayList<String>( list ) );
        }

        return blog;
    }

    @Override
    public BlogCreateResponse domainToCreateResponse(Blog domain) {
        if ( domain == null ) {
            return null;
        }

        BlogCreateResponse blogCreateResponse = new BlogCreateResponse();

        blogCreateResponse.setId( domain.getId() );
        blogCreateResponse.setTitle( domain.getTitle() );
        blogCreateResponse.setContent( domain.getContent() );
        blogCreateResponse.setAuthor( domain.getAuthor() );
        blogCreateResponse.setCreatedAt( domain.getCreatedAt() );
        blogCreateResponse.setUpdatedAt( domain.getUpdatedAt() );
        List<String> list = domain.getTags();
        if ( list != null ) {
            blogCreateResponse.setTags( new ArrayList<String>( list ) );
        }
        Set<Long> set = domain.getLikes();
        if ( set != null ) {
            blogCreateResponse.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getDislikes();
        if ( set1 != null ) {
            blogCreateResponse.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }

        return blogCreateResponse;
    }

    @Override
    public BlogGetResponse domainToGetResponse(Blog domain) {
        if ( domain == null ) {
            return null;
        }

        BlogGetResponse blogGetResponse = new BlogGetResponse();

        blogGetResponse.setId( domain.getId() );
        blogGetResponse.setTitle( domain.getTitle() );
        blogGetResponse.setContent( domain.getContent() );
        blogGetResponse.setAuthor( domain.getAuthor() );
        blogGetResponse.setCreatedAt( domain.getCreatedAt() );
        blogGetResponse.setUpdatedAt( domain.getUpdatedAt() );
        List<String> list = domain.getTags();
        if ( list != null ) {
            blogGetResponse.setTags( new ArrayList<String>( list ) );
        }
        Set<Long> set = domain.getLikes();
        if ( set != null ) {
            blogGetResponse.setLikes( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getDislikes();
        if ( set1 != null ) {
            blogGetResponse.setDislikes( new LinkedHashSet<Long>( set1 ) );
        }

        return blogGetResponse;
    }

    @Override
    public Blog updateToDomain(BlogUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        Blog blog = new Blog();

        blog.setId( request.getId() );
        blog.setTitle( request.getTitle() );
        blog.setContent( request.getContent() );
        List<String> list = request.getTags();
        if ( list != null ) {
            blog.setTags( new ArrayList<String>( list ) );
        }

        return blog;
    }
}
