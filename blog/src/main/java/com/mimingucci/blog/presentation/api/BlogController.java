package com.mimingucci.blog.presentation.api;

import com.mimingucci.blog.presentation.dto.request.BlogCreateRequest;
import com.mimingucci.blog.presentation.dto.request.BlogUpdateRequest;
import com.mimingucci.blog.presentation.dto.response.BaseResponse;
import com.mimingucci.blog.presentation.dto.response.BlogCreateResponse;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import com.mimingucci.blog.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;


public interface BlogController {
    BaseResponse<BlogCreateResponse> createBlog(BlogCreateRequest request, HttpServletRequest httpRequest);

    BaseResponse<BlogGetResponse> getBlogById(Long blogId);

    BaseResponse<PageableResponse<BlogGetResponse>> getBlogsByAuthor(Long id, Pageable pageable);

    BaseResponse<PageableResponse<BlogGetResponse>> getAll(Pageable pageable);

    BaseResponse<Boolean> deleteById(Long id, HttpServletRequest request);

    BaseResponse<BlogGetResponse> updateById(Long id, BlogUpdateRequest request, HttpServletRequest servletRequest);

    BaseResponse<BlogGetResponse> likeBlog(Long blogId, HttpServletRequest request);

    BaseResponse<BlogGetResponse> dislikeBlog(Long blogId, HttpServletRequest request);

    BaseResponse<String> uploadImage(MultipartFile file, HttpServletRequest request);
}