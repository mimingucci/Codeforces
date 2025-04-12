package com.mimingucci.user.domain.model;

import lombok.Data;

@Data
public class State {
    Long id;

    String name;

    Country country;
}
