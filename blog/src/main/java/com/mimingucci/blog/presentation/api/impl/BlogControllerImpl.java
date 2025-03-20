package com.mimingucci.blog.presentation.api.impl;

import com.mimingucci.blog.application.BlogApplicationService;
import com.mimingucci.blog.common.constant.PathConstants;
import com.mimingucci.blog.presentation.api.BlogController;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.response.BaseResponse;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_BLOG)
public class BlogControllerImpl implements BlogController {

    private final BlogApplicationService applicationService;

    @PostMapping
    @Override
    public BaseResponse<BlogCreateResponse> createBlog(@RequestBody @Validated BlogCreateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.applicationService.createBlog(request, httpRequest));
    }

    @GetMapping(path = PathConstants.BLOG_ID)
    @Override
    public BaseResponse<BlogGetResponse> getBlogById(@PathVariable("blogId") Long id) {
        return BaseResponse.success(this.applicationService.findBlogById(id));
    }
}
