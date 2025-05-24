package com.mimingucci.submission.infrastructure.repository.entity;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.common.enums.SubmissionVerdict;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEntity {
    @Id
    private Long id;

    private Long author;

    private Long problem;

    private Long contest;

    @Enumerated(EnumType.STRING)
    private SubmissionVerdict verdict = SubmissionVerdict.IN_QUEUE;

    private Instant sent = Instant.now();

    private Instant judged = null;

    private Long execution_time_ms = 0L;

    private Long memory_used_bytes = 0L;

    private SubmissionLanguage language;

    @Column(name = "source_code", nullable = false, updatable = false)
    private String sourceCode;
}
