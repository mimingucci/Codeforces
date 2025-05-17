package com.mimingucci.contest.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "virtual-contest")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VirtualContestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long user;

    @Column(nullable = false)
    private Long contest;

    @Column(nullable = false, name = "start_time")
    private Instant startTime;

    @Column(nullable = false, name = "end_time")
    private Instant endTime;

    @Column(nullable = false, name = "actual_start_time")
    private Instant actualStartTime;

    @Column(nullable = false, name = "actual_end_time")
    private Instant actualEndTime;
}