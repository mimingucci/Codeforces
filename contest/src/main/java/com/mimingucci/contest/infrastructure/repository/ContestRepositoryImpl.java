package com.mimingucci.contest.infrastructure.repository;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.infrastructure.repository.converter.ContestConverter;
import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.infrastructure.repository.jpa.ContestJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContestRepositoryImpl implements ContestRepository {
    private final ContestJpaRepository contestJpaRepository;

    private final ContestConverter converter;

    @Override
    public Contest createContest(Contest contest) {
        ContestEntity entity = this.converter.toEntity(contest);
        return this.converter.toDomain(this.contestJpaRepository.save(entity));
    }

    @Override
    public Contest updateContest(Long id, Contest contest) {
        Optional<ContestEntity> optional = this.contestJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        ContestEntity entity = optional.get();
        if (contest.getStartTime() != null) entity.setStartTime(contest.getStartTime());
        if (contest.getEndTime() != null) entity.setEndTime(contest.getEndTime());
        if (contest.getName() != null) entity.setName(contest.getName());
        if (contest.getAuthors() != null) entity.setAuthors(contest.getAuthors());
        if (contest.getTesters() != null) entity.setTesters(contest.getTesters());
        if (contest.getCoordinators() != null) entity.setCoordinators(contest.getCoordinators());
        if (entity.getType().equals(ContestType.NORMAL)) {
            if (contest.getEnabled() != null) entity.setEnabled(contest.getEnabled());
            if (contest.getIsPublic() != null) entity.setIsPublic(contest.getIsPublic());
        }
        return this.converter.toDomain(this.contestJpaRepository.save(entity));
    }

    @Override
    public Boolean deleteContest(Long id) {
        if (!this.contestJpaRepository.existsById(id)) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        this.contestJpaRepository.deleteById(id);
        return true;
    }

    @Override
    public Contest getContest(Long id) {
        Optional<ContestEntity> optional = this.contestJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        return this.converter.toDomain(optional.get());
    }
}
