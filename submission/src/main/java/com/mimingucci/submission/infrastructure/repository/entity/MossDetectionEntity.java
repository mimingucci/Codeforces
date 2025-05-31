package com.mimingucci.submission.infrastructure.repository.entity;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "moss_detection")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MossDetectionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contest_id", nullable = false, unique = true)
    private Long contestId;

    @Column(name = "detection_time", nullable = false)
    private Instant detectionTime;

    @Column(name = "result_url")
    private String resultUrl;

    @Enumerated(EnumType.STRING)
    private SubmissionLanguage language;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "message")
    private String message;
}
