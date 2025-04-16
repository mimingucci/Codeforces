package com.mimingucci.contest.domain.service;

import com.mimingucci.contest.domain.model.ContestRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContestRegistrationService {
    ContestRegistration register(ContestRegistration domain);

    Page<ContestRegistration> getAll(Long contestId, Pageable pageable);

    void cancelRegistration(Long contestId, Long userId);

    ContestRegistration update(ContestRegistration domain);

    ContestRegistration getById(Long userId, Long contestId);

    Boolean checkUserCanSubmit(Long userId, Long contestId);
}
