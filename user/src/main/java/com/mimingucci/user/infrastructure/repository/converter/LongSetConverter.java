package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.common.enums.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class LongSetConverter implements AttributeConverter<Set<Long>, String> {

    private static final String DELIMITER = ",";
    private static final String EMPTY_STRING = "";

    @Override
    public String convertToDatabaseColumn(Set<Long> longs) {
        if (longs == null || longs.isEmpty()) {
            return EMPTY_STRING;
        }
        return longs.stream()
                .map(i -> Long.toString(i))
                .sorted() // Optional: keep consistent ordering
                .collect(Collectors.joining(DELIMITER));
    }

    @Override
    public Set<Long> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return Collections.emptySet();
        }

        return Arrays.stream(dbData.split(DELIMITER))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf) // Using our safe conversion method
                .collect(Collectors.toCollection(LinkedHashSet::new)); // Preserve insertion order
    }
}
