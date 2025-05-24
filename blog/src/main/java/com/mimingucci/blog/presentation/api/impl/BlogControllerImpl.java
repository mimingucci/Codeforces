package com.mimingucci.blog.presentation.api.impl;

import com.mimingucci.blog.application.BlogApplicationService;
import com.mimingucci.blog.common.constant.PathConstants;
import com.mimingucci.blog.presentation.api.BlogController;
import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BaseResponse;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import com.mimingucci.blog.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_BLOG)
public class BlogControllerImpl implements BlogController {

    private final BlogApplicationService applicationService;

    @GetMapping(path = PathConstants.ALL)
    @Override
    public BaseResponse<PageableResponse<BlogGetResponse>> getAll(Pageable pageable) {
        return BaseResponse.success(this.applicationService.getAll(pageable));
    }

    @PostMapping(path = PathConstants.UPLOAD)
    @Override
    public BaseResponse<String> uploadImage(@RequestParam("image") MultipartFile file, HttpServletRequest request) {
        return BaseResponse.success(applicationService.uploadImage(file, request));
    }

    @GetMapping(path = PathConstants.USER + PathConstants.USER_ID)
    @Override
    public BaseResponse<PageableResponse<BlogGetResponse>> getBlogsByAuthor(@PathVariable(name = "userId") Long id, Pageable pageable) {
        return BaseResponse.success(applicationService.getByAuthor(id, pageable));
    }

    @PutMapping(path = PathConstants.BLOG_ID + PathConstants.LIKE)
    @Override
    public BaseResponse<BlogGetResponse> likeBlog(@PathVariable("blogId") Long blogId, HttpServletRequest request) {
        return BaseResponse.success(this.applicationService.like(blogId, request));
    }

    @PutMapping(path = PathConstants.BLOG_ID + PathConstants.DISLIKE)
    @Override
    public BaseResponse<BlogGetResponse> dislikeBlog(@PathVariable("blogId") Long blogId, HttpServletRequest request) {
        return BaseResponse.success(this.applicationService.dislike(blogId, request));
    }

    @DeleteMapping(path = PathConstants.BLOG_ID)
    @Override
    public BaseResponse<Boolean> deleteById(@PathVariable("blogId") Long id, HttpServletRequest request) {
        return BaseResponse.success(this.applicationService.deleteById(id, request));
    }

    @PutMapping(path = PathConstants.BLOG_ID)
    @Override
    public BaseResponse<BlogGetResponse> updateById(@PathVariable("blogId") Long id, @RequestBody @Validated BlogUpdateRequest request, HttpServletRequest servletRequest) {
        request.setId(id);
        return BaseResponse.success(this.applicationService.updateById(request, servletRequest));
    }

    @GetMapping(path = PathConstants.BLOG_ID)
    @Override
    public BaseResponse<BlogGetResponse> getBlogById(@PathVariable("blogId") Long id) {
        return BaseResponse.success(this.applicationService.findBlogById(id));
    }

    @PostMapping
    @Override
    public BaseResponse<BlogCreateResponse> createBlog(@RequestBody @Validated BlogCreateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.applicationService.createBlog(request, httpRequest));
    }
}
