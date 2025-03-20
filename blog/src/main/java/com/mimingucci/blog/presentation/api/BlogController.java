package com.mimingucci.blog.presentation.api;

import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BaseResponse;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface BlogController {
    BaseResponse<BlogCreateResponse> createBlog(BlogCreateRequest request, HttpServletRequest httpRequest);

    BaseResponse<BlogGetResponse> getBlogById(Long blogId);
}
