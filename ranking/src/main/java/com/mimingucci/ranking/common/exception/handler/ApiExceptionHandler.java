package com.mimingucci.ranking.common.exception.handler;

import com.mimingucci.ranking.common.exception.ApiRequestException;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
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
