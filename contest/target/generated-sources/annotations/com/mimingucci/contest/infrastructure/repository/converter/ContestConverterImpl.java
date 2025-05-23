package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.infrastructure.repository.entity.ContestEntity;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ContestConverterImpl implements ContestConverter {

    @Override
    public ContestEntity toEntity(Contest contest) {
        if ( contest == null ) {
            return null;
        }

        ContestEntity contestEntity = new ContestEntity();

        contestEntity.setId( contest.getId() );
        contestEntity.setName( contest.getName() );
        contestEntity.setStartTime( contest.getStartTime() );
        contestEntity.setEndTime( contest.getEndTime() );
        contestEntity.setEnabled( contest.getEnabled() );
        contestEntity.setType( contest.getType() );
        contestEntity.setIsPublic( contest.getIsPublic() );
        Set<Long> set = contest.getCoordinators();
        if ( set != null ) {
            contestEntity.setCoordinators( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = contest.getAuthors();
        if ( set1 != null ) {
            contestEntity.setAuthors( new LinkedHashSet<Long>( set1 ) );
        }
        Set<Long> set2 = contest.getTesters();
        if ( set2 != null ) {
            contestEntity.setTesters( new LinkedHashSet<Long>( set2 ) );
        }
        contestEntity.setCreatedBy( contest.getCreatedBy() );

        return contestEntity;
    }

    @Override
    public Contest toDomain(ContestEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Contest contest = new Contest();

        contest.setId( entity.getId() );
        contest.setName( entity.getName() );
        contest.setStartTime( entity.getStartTime() );
        contest.setEndTime( entity.getEndTime() );
        Set<Long> set = entity.getAuthors();
        if ( set != null ) {
            contest.setAuthors( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = entity.getTesters();
        if ( set1 != null ) {
            contest.setTesters( new LinkedHashSet<Long>( set1 ) );
        }
        Set<Long> set2 = entity.getCoordinators();
        if ( set2 != null ) {
            contest.setCoordinators( new LinkedHashSet<Long>( set2 ) );
        }
        contest.setEnabled( entity.getEnabled() );
        contest.setType( entity.getType() );
        contest.setCreatedBy( entity.getCreatedBy() );
        contest.setIsPublic( entity.getIsPublic() );

        return contest;
    }
}
