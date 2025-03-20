package com.mimingucci.blog.application;

import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface BlogApplicationService {

    BlogCreateResponse createBlog(BlogCreateRequest request, HttpServletRequest httpRequest);

    BlogGetResponse findBlogById(Long id);
}
