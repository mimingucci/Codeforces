package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.model.ContestRegistrationId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ContestRegistrationRepository {
    Boolean hasRegistered(ContestRegistrationId contestRegistrationId);
    ContestRegistration register(ContestRegistration contestRegistration);
    ContestRegistration updateRegister(ContestRegistration contestRegistration);
    Boolean deleteRegistration(ContestRegistrationId id);

    Page<ContestRegistration> getAll(Long contestId, Pageable pageable);

    ContestRegistration getById(Long userId, Long contestId);
}
