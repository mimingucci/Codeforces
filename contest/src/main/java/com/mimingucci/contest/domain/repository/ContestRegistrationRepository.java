package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.model.ContestRegistrationId;

public interface ContestRegistrationRepository {
    Boolean hasRegistered(ContestRegistrationId contestRegistrationId);
    ContestRegistration register(ContestRegistration contestRegistration);
    ContestRegistration updateRegister(ContestRegistration contestRegistration);
    Boolean deleteRegistration(ContestRegistrationId id);
}
