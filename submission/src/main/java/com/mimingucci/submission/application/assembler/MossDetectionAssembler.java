package com.mimingucci.submission.application.assembler;

import com.mimingucci.submission.domain.model.MossDetection;
import com.mimingucci.submission.presentation.dto.response.MossPlagiarismResponse;
import org.springframework.stereotype.Component;

@Component
public class MossDetectionAssembler {

    public MossPlagiarismResponse toResponse(MossDetection domain) {
        if (domain == null) return null;

        MossPlagiarismResponse response = new MossPlagiarismResponse();
        response.setId(domain.getId());
        response.setContestId(domain.getContestId());
        response.setDetectionTime(domain.getDetectionTime());
        response.setResultUrl(domain.getResultUrl());
        response.setLanguage(domain.getLanguage());
        response.setStatus(domain.getStatus());
        response.setMessage(domain.getMessage());

        return response;
    }
}
