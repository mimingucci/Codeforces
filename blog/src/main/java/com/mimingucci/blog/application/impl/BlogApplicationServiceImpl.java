package com.mimingucci.blog.application.impl;

import com.mimingucci.blog.application.BlogApplicationService;
import com.mimingucci.blog.application.assembler.BlogAssembler;
import com.mimingucci.blog.common.constant.ErrorMessageConstants;
import com.mimingucci.blog.common.exception.ApiRequestException;
import com.mimingucci.blog.common.util.JwtUtil;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.service.BlogService;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogApplicationServiceImpl implements BlogApplicationService {
    private final BlogService service;

    private final JwtUtil jwtUtil;

    @Override
    public BlogCreateResponse createBlog(BlogCreateRequest request, HttpServletRequest httpRequest) {
        Blog domain = BlogAssembler.INSTANCE.createRequestToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpRequest);
            domain.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return BlogAssembler.INSTANCE.domainToCreateResponse(this.service.createBlog(domain));
    }

    @Override
    public BlogGetResponse findBlogById(Long id) {
        return BlogAssembler.INSTANCE.domainToGetResponse(this.service.findBlogById(id));
    }
}
