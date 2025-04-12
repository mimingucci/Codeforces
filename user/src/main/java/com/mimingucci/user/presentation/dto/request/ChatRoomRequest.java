package com.mimingucci.user.presentation.dto.request;

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

    boolean isGroupChat = false;
}
