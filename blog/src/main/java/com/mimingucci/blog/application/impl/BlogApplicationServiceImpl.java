package com.mimingucci.blog.application.impl;

import com.mimingucci.blog.application.BlogApplicationService;
import com.mimingucci.blog.application.assembler.BlogAssembler;
import com.mimingucci.blog.common.constant.ErrorMessageConstants;
import com.mimingucci.blog.common.exception.ApiRequestException;
import com.mimingucci.blog.common.util.JwtUtil;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.service.BlogService;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import com.mimingucci.blog.presentation.dto.response.PageableResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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

    @Override
    public PageableResponse<BlogGetResponse> getAll(Pageable pageable) {
        return BlogAssembler.INSTANCE.pageToResponse(this.service.getAll(pageable));
    }

    @Override
    public Boolean deleteById(Long id, HttpServletRequest request) {
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            return this.service.deleteById(id, claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public BlogGetResponse updateById(BlogUpdateRequest request, HttpServletRequest servletRequest) {
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(servletRequest);
            Blog blog = BlogAssembler.INSTANCE.updateToDomain(request);
            blog.setAuthor(claims.get("id", Long.class));
            return BlogAssembler.INSTANCE.domainToGetResponse(this.service.updateById(blog));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public BlogGetResponse like(Long blogId, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return BlogAssembler.INSTANCE.domainToGetResponse(this.service.likeBlog(blogId, userId));
    }

    @Override
    public BlogGetResponse dislike(Long blogId, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return BlogAssembler.INSTANCE.domainToGetResponse(this.service.dislikeBlog(blogId, userId));
    }
}
