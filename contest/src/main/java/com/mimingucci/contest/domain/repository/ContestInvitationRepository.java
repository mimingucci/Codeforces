package com.mimingucci.contest.domain.repository;

import com.mimingucci.contest.domain.model.ContestInvitation;

public interface ContestInvitationRepository {
    ContestInvitation invite(ContestInvitation contestInvitation);
    Boolean deleteInvite(ContestInvitation contestInvitation);
}
