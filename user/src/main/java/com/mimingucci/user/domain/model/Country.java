package com.mimingucci.user.domain.model;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class Country {
    Long id;

    String name;

    String code;

    Set<State> states = new HashSet<>();
}
