package com.mimingucci.ranking.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mimingucci.ranking.domain.client.response.ContestRegistrationResponse;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class ContestantsConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String toJsonString(List<ContestRegistrationResponse> contestants) {
        try {
            return objectMapper.writeValueAsString(contestants);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting contestants to JSON", e);
        }
    }

    public static List<ContestRegistrationResponse> fromJsonString(String contestantsJson) {
        try {
            return objectMapper.readValue(contestantsJson,
                    new TypeReference<List<ContestRegistrationResponse>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to contestants", e);
        }
    }
}
