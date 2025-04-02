package com.mimingucci.contest.infrastructure.repository;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.model.ContestRegistrationId;
import com.mimingucci.contest.domain.repository.ContestRegistrationRepository;
import com.mimingucci.contest.infrastructure.repository.converter.ContestRegistrationConverter;
import com.mimingucci.contest.infrastructure.repository.converter.ContestRegistrationIdConverter;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationEntity;
import com.mimingucci.contest.infrastructure.repository.jpa.ContestRegistrationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContestRegistrationRepositoryImpl implements ContestRegistrationRepository {
    private final ContestRegistrationJpaRepository contestRegistrationJpaRepository;

    @Override
    public Boolean hasRegistered(ContestRegistrationId contestRegistrationId) {
        return this.contestRegistrationJpaRepository.existsById(ContestRegistrationIdConverter.INSTANCE.toEntity(contestRegistrationId));
    }

    @Override
    public ContestRegistration register(ContestRegistration contestRegistration) {
        return ContestRegistrationConverter.INSTANCE.toDomain(this.contestRegistrationJpaRepository.save(ContestRegistrationConverter.INSTANCE.toEntity(contestRegistration)));
    }

    @Override
    public ContestRegistration updateRegister(ContestRegistration contestRegistration) {
        ContestRegistrationEntity entity = this.contestRegistrationJpaRepository.findById(new com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId(contestRegistration.getUser(), contestRegistration.getContest())).orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND));
        if (contestRegistration.getRated() != null) entity.setRated(contestRegistration.getRated());
        if (contestRegistration.getParticipated() != null)
            entity.setParticipated(contestRegistration.getParticipated());
        ContestRegistrationEntity updatedEntity = this.contestRegistrationJpaRepository.save(entity);
        return ContestRegistrationConverter.INSTANCE.toDomain(updatedEntity);
    }

    @Override
    public Boolean deleteRegistration(ContestRegistrationId id) {
        if (!this.contestRegistrationJpaRepository.existsById(ContestRegistrationIdConverter.INSTANCE.toEntity(id))) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        this.contestRegistrationJpaRepository.deleteById(ContestRegistrationIdConverter.INSTANCE.toEntity(id));
        return true;
    }
}
