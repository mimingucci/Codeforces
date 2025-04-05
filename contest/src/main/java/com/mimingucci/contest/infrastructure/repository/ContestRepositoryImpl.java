package com.mimingucci.contest.infrastructure.repository;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.enums.Role;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.infrastructure.repository.converter.ContestConverter;
import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.infrastructure.repository.jpa.ContestJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContestRepositoryImpl implements ContestRepository {
    private final ContestJpaRepository contestJpaRepository;

    @Override
    public Contest createContest(Contest contest) {
        ContestEntity entity = ContestConverter.INSTANCE.toEntity(contest);
        return ContestConverter.INSTANCE.toDomain(this.contestJpaRepository.save(entity));
    }

    @Override
    public Contest updateContest(Long userId, Set<Role> roles, Long id, Contest contest) {
        Optional<ContestEntity> optional = this.contestJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        ContestEntity entity = optional.get();
        if (!entity.getAuthors().contains(userId) && !roles.contains(Role.ADMIN) && !roles.contains(Role.SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.FORBIDDEN);
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
        return ContestConverter.INSTANCE.toDomain(this.contestJpaRepository.save(entity));
    }

    @Override
    public Boolean deleteContest(Long userId, Set<Role> roles, Long id) {
        Optional<ContestEntity> optional = this.contestJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        ContestEntity entity = optional.get();
        if (!entity.getAuthors().contains(userId) && !roles.contains(Role.ADMIN) && !roles.contains(Role.SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.FORBIDDEN);
        this.contestJpaRepository.deleteById(id);
        return true;
    }

    @Override
    public Contest getContest(Long id) {
        Optional<ContestEntity> optional = this.contestJpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        return ContestConverter.INSTANCE.toDomain(optional.get());
    }

    @Override
    public Contest getStaredContestById(Long id) {
        Instant now = Instant.now();
        ContestEntity entity = contestJpaRepository.findByIdAndStartTimeLessThanEqual(id, now);
        if (entity == null) throw new ApiRequestException(ErrorMessageConstants.CONTEST_NOT_FOUND, HttpStatus.NOT_FOUND);
        return ContestConverter.INSTANCE.toDomain(entity);
    }

    @Override
    public Page<Contest> getListContests(String name, Pageable pageable) {
        return this.contestJpaRepository.findByNameContainingIgnoreCase(name, pageable).map(ContestConverter.INSTANCE::toDomain);
    }
}
