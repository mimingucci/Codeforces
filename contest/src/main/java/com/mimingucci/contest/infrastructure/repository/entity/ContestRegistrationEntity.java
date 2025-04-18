package com.mimingucci.contest.infrastructure.repository.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contest_registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ContestRegistrationId.class)
public class ContestRegistrationEntity {
    @Id
    private Long user;

    @Id
    private Long contest;

    private Boolean rated = true;

    private Boolean participated = false;
}

