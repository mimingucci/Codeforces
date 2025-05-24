package com.mimingucci.ranking.infrastructure.repository.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Converter
public class LongIntegerMapConverter implements AttributeConverter<Map<Long, Integer>, String> {

    @Override
    public String convertToDatabaseColumn(Map<Long, Integer> attribute) {
        if (attribute == null || attribute.isEmpty()) return "";
        return attribute.entrySet().stream()
                .map(entry -> entry.getKey() + "-" + entry.getValue())
                .collect(Collectors.joining(","));
    }

    @Override
    public Map<Long, Integer> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return new HashMap<>();
        return Arrays.stream(dbData.split(","))
                .map(String::trim)
                .map(entry -> entry.split("-"))
                .filter(parts -> parts.length == 2)
                .collect(Collectors.toMap(
                        parts -> Long.valueOf(parts[0]),
                        parts -> Integer.valueOf(parts[1])
                ));
    }
}

