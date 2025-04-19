package com.mimingucci.ranking.domain.client.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContestRegistrationResponse {
    Long user;

    Long contest;

    Boolean rated;

    Boolean participated;
}
