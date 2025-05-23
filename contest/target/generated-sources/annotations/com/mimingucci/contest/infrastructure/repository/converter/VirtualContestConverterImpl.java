package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.infrastructure.repository.entity.VirtualContestEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class VirtualContestConverterImpl implements VirtualContestConverter {

    @Override
    public VirtualContestEntity toEntity(VirtualContest domain) {
        if ( domain == null ) {
            return null;
        }

        VirtualContestEntity virtualContestEntity = new VirtualContestEntity();

        virtualContestEntity.setId( domain.getId() );
        virtualContestEntity.setUser( domain.getUser() );
        virtualContestEntity.setContest( domain.getContest() );
        virtualContestEntity.setStartTime( domain.getStartTime() );
        virtualContestEntity.setEndTime( domain.getEndTime() );
        virtualContestEntity.setActualStartTime( domain.getActualStartTime() );
        virtualContestEntity.setActualEndTime( domain.getActualEndTime() );

        return virtualContestEntity;
    }

    @Override
    public VirtualContest toDomain(VirtualContestEntity entity) {
        if ( entity == null ) {
            return null;
        }

        VirtualContest virtualContest = new VirtualContest();

        virtualContest.setId( entity.getId() );
        virtualContest.setContest( entity.getContest() );
        virtualContest.setUser( entity.getUser() );
        virtualContest.setStartTime( entity.getStartTime() );
        virtualContest.setEndTime( entity.getEndTime() );
        virtualContest.setActualStartTime( entity.getActualStartTime() );
        virtualContest.setActualEndTime( entity.getActualEndTime() );

        return virtualContest;
    }
}
