package com.mimingucci.blog.application.assembler;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.util.IdGenerator;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class BlogAssembler {
    public Blog createRequestToDomain(BlogCreateRequest request) {
        Blog blog = this.createToDomain(request);
        blog.setId(IdGenerator.INSTANCE.nextId());
        return blog;
    }

    public abstract Blog createToDomain(BlogCreateRequest request);

    public abstract BlogCreateResponse domainToCreateResponse(Blog domain);

    public abstract BlogGetResponse domainToGetResponse(Blog domain);
}
