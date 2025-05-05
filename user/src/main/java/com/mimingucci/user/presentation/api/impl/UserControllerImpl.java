package com.mimingucci.user.presentation.api.impl;

import com.mimingucci.user.application.UserApplicationService;
import com.mimingucci.user.common.constant.PathConstants;
import com.mimingucci.user.presentation.api.UserController;
import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_USER)
public class UserControllerImpl implements UserController {
    private final UserApplicationService userApplicationService;

    @GetMapping(path = PathConstants.USERNAME + PathConstants.USER_USERNAME)
    @Override
    public BaseResponse<UserGetResponse> getUserByUsername(@PathVariable("userName") String username) {
        return BaseResponse.success(this.userApplicationService.getUserByUsername(username));
    }

    @GetMapping(path = PathConstants.ALL)
    @Override
    public BaseResponse<PageableResponse<UserGetResponse>> getAll(@ModelAttribute UserParam param, Pageable pageable) {
        return BaseResponse.success(this.userApplicationService.getAll(param, pageable));
    }

//    @Caching(evict = {
//            @CacheEvict(value = "users", key = "#userId"),
//    })
    @PutMapping(path = PathConstants.BAN + PathConstants.USER_ID)
    @Override
    public BaseResponse<Boolean> banAccount(@PathVariable("userId") Long userId, HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.ban(userId, request));
    }

//    @Caching(evict = {
//            @CacheEvict(value = "users", key = "#userId"),
//    })
    @PutMapping(path = PathConstants.ROLE + PathConstants.USER_ID)
    @Override
    public BaseResponse<Boolean> addAdmin(@PathVariable("userId") Long userId, HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.changeRole(userId, request));
    }

    @PostMapping(path = PathConstants.AVATAR)
    @Override
    public BaseResponse<String> uploadAvatar(@RequestParam("avatar") MultipartFile file, HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.uploadAvatar(file, request));
    }

    @DeleteMapping(path = PathConstants.AVATAR)
    @Override
    public BaseResponse<Boolean> unsetAvatar(HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.unsetAvatar(request));
    }

    @PostMapping(path = PathConstants.BATCH)
    @Override
    public BaseResponse<List<UserGetResponse>> getUserByIds(@RequestBody @Validated List<Long> userIds) {
        return BaseResponse.success(this.userApplicationService.getUserByIds(userIds));
    }

//    @Caching(evict = {
//            @CacheEvict(value = "users", allEntries = true),
//    })
    @PutMapping(path = PathConstants.RATING)
    @Override
    public BaseResponse<Boolean> updateUserRatings(@RequestBody @Validated List<Pair<Long, Integer>> users, @RequestHeader(value = "Authorization", required = true) String authToken) {
        return BaseResponse.success(this.userApplicationService.updateRatings(users, authToken));
    }

    @GetMapping(path = PathConstants.SEARCH)
    @Override
    public BaseResponse<PageableResponse<UserGetResponse>> search(@RequestParam("query") String query, Pageable pageable) {
        return BaseResponse.success(this.userApplicationService.search(query, pageable));
    }

    //    @Caching(put = {
//            @CachePut(value = "users", key = "#request.id"),
//    })
    @PutMapping(path = PathConstants.UPDATE)
    @Override
    public BaseResponse<UserGetResponse> updateProfile(@RequestBody @Validated UserUpdateRequest request) {
        return BaseResponse.success(this.userApplicationService.updateProfile(request));
    }

//    @Cacheable(value = "users", key = "#userId")
    @GetMapping(path = PathConstants.USER_ID)
    @Override
    public BaseResponse<UserGetResponse> getUserById(@PathVariable("userId") Long userId) {
        return BaseResponse.success(this.userApplicationService.getUserById(userId));
    }
}
