package com.mimingucci.ranking.infrastructure.repository.entity;

import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "submission-result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultEntity {
    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    private SubmissionVerdict verdict = SubmissionVerdict.IN_QUEUE;

    private Long author;

    private Long contest;

    private Long problem;

    private Long execution_time_ms;

    private Long memory_used_kb;

    private Integer score;

    private Instant judged_on;
}
