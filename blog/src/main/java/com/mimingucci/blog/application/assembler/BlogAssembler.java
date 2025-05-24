package com.mimingucci.blog.application.assembler;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.util.IdGenerator;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import com.mimingucci.blog.presentation.dto.response.PageableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BlogAssembler {
    BlogAssembler INSTANCE = org.mapstruct.factory.Mappers.getMapper(BlogAssembler.class);

    Blog createToDomain(BlogCreateRequest request);

    BlogCreateResponse domainToCreateResponse(Blog domain);

    BlogGetResponse domainToGetResponse(Blog domain);

    Blog updateToDomain(BlogUpdateRequest request);

    default Blog createRequestToDomain(BlogCreateRequest request) {
        Blog blog = this.createToDomain(request);
        blog.setId(IdGenerator.INSTANCE.nextId());
        return blog;
    }

    default PageableResponse<BlogGetResponse> pageToResponse(Page<Blog> page) {
        PageableResponse<BlogGetResponse> response = new PageableResponse<>();
        response.setContent(page.getContent().stream().map(this::domainToGetResponse).toList());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}
