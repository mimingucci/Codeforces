package com.mimingucci.blog.application.assembler;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.util.IdGenerator;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BlogAssembler {
    BlogAssembler INSTANCE = org.mapstruct.factory.Mappers.getMapper(BlogAssembler.class);

    Blog createToDomain(BlogCreateRequest request);

    BlogCreateResponse domainToCreateResponse(Blog domain);

    BlogGetResponse domainToGetResponse(Blog domain);

    default Blog createRequestToDomain(BlogCreateRequest request) {
        Blog blog = this.createToDomain(request);
        blog.setId(IdGenerator.INSTANCE.nextId());
        return blog;
    }
}
