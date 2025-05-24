package com.mimingucci.user.presentation.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class ChatRoomRequest {
    Long id;

    String name;

    Set<Long> participants = new HashSet<>();

    Set<Long> admins = new HashSet<>();

    @JsonProperty("isGroupChat")
    boolean isGroupChat = false;
}
