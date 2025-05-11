package com.mimingucci.contest.domain.service;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ContestRegistrationService {
    ContestRegistration register(ContestRegistration domain);

    Page<ContestRegistration> getAll(Long contestId, Pageable pageable);

    List<ContestRegistration> getAll(Long contestId);

    void cancelRegistration(Long contestId, Long userId);

    ContestRegistration update(ContestRegistration domain);

    ContestRegistration getById(Long userId, Long contestId);

    Boolean checkUserCanSubmit(Long userId, Long contestId);

    Boolean isUserInRunningContest(Long userId);
}
