package com.mimingucci.comment.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentUpdateRequest {
    @NotNull
    @NotBlank
    @Size(max = 1000)
    String content;
}
