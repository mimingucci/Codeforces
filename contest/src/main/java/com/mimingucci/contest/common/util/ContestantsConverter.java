package com.mimingucci.contest.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mimingucci.contest.domain.model.ContestRegistration;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class ContestantsConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String toJsonString(List<ContestRegistration> contestants) {
        try {
            return objectMapper.writeValueAsString(contestants);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting contestants to JSON", e);
        }
    }
}
