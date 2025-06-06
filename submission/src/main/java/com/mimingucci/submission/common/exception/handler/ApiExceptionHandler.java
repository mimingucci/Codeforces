package com.mimingucci.submission.common.exception.handler;

import com.mimingucci.submission.common.exception.ApiRequestException;
import com.mimingucci.submission.presentation.dto.response.BaseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ApiRequestException.class)
    public ResponseEntity<BaseResponse<?>> handleApiRequestException(ApiRequestException exception) {
        return ResponseEntity.status(exception.getStatus()).body(BaseResponse.error(exception.getStatus().toString(), exception.getMessage()));
    }
}