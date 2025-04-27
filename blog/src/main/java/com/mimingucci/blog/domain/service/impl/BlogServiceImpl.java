package com.mimingucci.blog.domain.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mimingucci.blog.common.constant.ErrorMessageConstants;
import com.mimingucci.blog.common.exception.ApiRequestException;
import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.domain.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    private final Cloudinary cloudinary;

    @Override
    public Blog createBlog(Blog domain) {
        return this.blogRepository.createBlog(domain);
    }

    @Override
    public Blog findBlogById(Long id) {
        return this.blogRepository.findById(id);
    }

    @Override
    public List<Blog> findByTag(String tagName) {
        return this.blogRepository.findByTag(tagName);
    }

    @Override
    public Boolean deleteById(Long id, Long author) {
        return this.blogRepository.deleteBlog(id, author);
    }

    @Override
    public Page<Blog> getAll(Pageable pageable) {
        return this.blogRepository.findAll(pageable);
    }

    @Override
    public Page<Blog> getAllByUserId(Long userId, Pageable pageable) {
        return this.blogRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public Blog updateById(Blog blog) {
        return this.blogRepository.updateBlog(blog);
    }

    @Override
    public Blog likeBlog(Long blogId, Long userId) {
        return this.blogRepository.likeBlog(blogId, userId);
    }

    @Override
    public Blog dislikeBlog(Long blogId, Long userId) {
        return this.blogRepository.dislikeBlog(blogId, userId);
    }

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new ApiRequestException(ErrorMessageConstants.UPLOAD_IMAGE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
