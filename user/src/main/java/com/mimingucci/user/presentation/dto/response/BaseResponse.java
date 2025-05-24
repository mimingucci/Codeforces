package com.mimingucci.user.presentation.dto.response;

import lombok.With;

import java.io.Serializable;

public record BaseResponse<T>(
        @With
        String code,
        @With
        String message,
        @With
        T data
) implements Serializable {

    public static final String SUCCESS_CODE = "200";
    public static final String SUCCESS_MESSAGE = "Success";

    public static <T> BaseResponse<T> error(String code, String message) {
        return new BaseResponse<>(code, message, null);
    }

    public static <T> BaseResponse<T> success() {
        return success(null);
    }

    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(SUCCESS_CODE, SUCCESS_MESSAGE, data);
    }
}
