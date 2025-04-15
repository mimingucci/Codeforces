package com.mimingucci.contest.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "contest_invitation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ContestRegistrationId.class)
public class ContestInvitationEntity {
    @Id
    private Long user;

    @Id
    private Long contest;

    @Column(name = "invitation_time", nullable = false)
    private Instant invitationTime;

    @Column(name = "accepted")
    private Boolean accepted;

    @Column(name = "response_time")
    private Instant responseTime;

    @Column(name = "invitation_message")
    private String invitationMessage;

    @PrePersist
    protected void onCreate() {
        invitationTime = Instant.now();
    }
}
