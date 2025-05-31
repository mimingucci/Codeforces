package com.mimingucci.submission.domain.service;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.domain.model.MossDetection;

import java.util.List;

public interface MossService {
    MossDetection detectPlagiarism(Long contestId, SubmissionLanguage language);
    MossDetection getByContestIdAndLanguage(Long contestId, SubmissionLanguage language);
    List<MossDetection> getAllByContestId(Long contestId);
}