package com.mimingucci.user.domain.model.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatus {
    private Long user;
    private Status status;
    private Instant lastActive;

    public enum Status {
        ONLINE, OFFLINE
    }
}
