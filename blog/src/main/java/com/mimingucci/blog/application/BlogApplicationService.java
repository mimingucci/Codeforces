package com.mimingucci.blog.application;

import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import com.mimingucci.blog.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface BlogApplicationService {

    BlogCreateResponse createBlog(BlogCreateRequest request, HttpServletRequest httpRequest);

    BlogGetResponse findBlogById(Long id);

    PageableResponse<BlogGetResponse> getAll(Pageable pageable);

    Boolean deleteById(Long id, HttpServletRequest request);

    BlogGetResponse updateById(BlogUpdateRequest request, HttpServletRequest servletRequest);
}
