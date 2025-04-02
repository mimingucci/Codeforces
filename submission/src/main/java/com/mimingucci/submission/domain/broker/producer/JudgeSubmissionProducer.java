package com.mimingucci.submission.domain.broker.producer;

import com.mimingucci.submission.domain.event.JudgeSubmissionEvent;

public interface JudgeSubmissionProducer {
    void sendSubmissionToJudge(JudgeSubmissionEvent event);
}
