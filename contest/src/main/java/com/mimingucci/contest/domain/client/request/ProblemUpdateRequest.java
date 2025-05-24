package com.mimingucci.contest.domain.client.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemUpdateRequest {
    Boolean isPublished;
}
