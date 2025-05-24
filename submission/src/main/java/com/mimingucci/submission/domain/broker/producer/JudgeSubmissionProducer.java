package com.mimingucci.submission.domain.broker.producer;

import com.mimingucci.submission.domain.event.JudgeSubmissionEvent;
import com.mimingucci.submission.domain.event.JudgeVirtualSubmissionEvent;

public interface JudgeSubmissionProducer {
    void sendSubmissionToJudge(JudgeSubmissionEvent event);

    void sendVirtualSubmissionToJudge(JudgeVirtualSubmissionEvent event);
}
