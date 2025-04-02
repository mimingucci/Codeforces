package com.mimingucci.contest.infrastructure.repository;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.model.ContestInvitation;
import com.mimingucci.contest.domain.repository.ContestInvitationRepository;
import com.mimingucci.contest.infrastructure.repository.converter.ContestInvitationConverter;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import com.mimingucci.contest.infrastructure.repository.jpa.ContestInvitationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContestInvitationRepositoryImpl implements ContestInvitationRepository {
    private final ContestInvitationJpaRepository contestInvitationJpaRepository;

    @Override
    public ContestInvitation invite(ContestInvitation contestInvitation) {
        return ContestInvitationConverter.INSTANCE.toDomain(this.contestInvitationJpaRepository.save(ContestInvitationConverter.INSTANCE.toEntity(contestInvitation)));
    }

    @Override
    public Boolean deleteInvite(ContestInvitation contestInvitation) {
        if (!this.contestInvitationJpaRepository.existsById(new ContestRegistrationId(contestInvitation.getUser(), contestInvitation.getContest()))) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        this.contestInvitationJpaRepository.deleteById(new ContestRegistrationId(contestInvitation.getUser(), contestInvitation.getContest()));
        return true;
    }
}
