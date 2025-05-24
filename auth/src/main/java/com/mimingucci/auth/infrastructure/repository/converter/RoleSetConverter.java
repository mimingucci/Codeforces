package com.mimingucci.auth.infrastructure.repository.converter;

import com.mimingucci.auth.common.enums.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class RoleSetConverter implements AttributeConverter<Set<Role>, String> {

    private static final String DELIMITER = ",";
    private static final String EMPTY_STRING = "";

    @Override
    public String convertToDatabaseColumn(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return EMPTY_STRING;
        }
        return roles.stream()
                .map(Enum::name)
                .sorted() // Optional: keep consistent ordering
                .collect(Collectors.joining(DELIMITER));
    }

    @Override
    public Set<Role> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return Collections.emptySet();
        }

        return Arrays.stream(dbData.split(DELIMITER))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Role::fromString) // Using our safe conversion method
                .collect(Collectors.toCollection(LinkedHashSet::new)); // Preserve insertion order
    }
}