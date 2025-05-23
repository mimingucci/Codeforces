package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.ContestInvitation;
import com.mimingucci.contest.infrastructure.repository.entity.ContestInvitationEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ContestInvitationConverterImpl implements ContestInvitationConverter {

    @Override
    public ContestInvitationEntity toEntity(ContestInvitation domain) {
        if ( domain == null ) {
            return null;
        }

        ContestInvitationEntity contestInvitationEntity = new ContestInvitationEntity();

        contestInvitationEntity.setUser( domain.getUser() );
        contestInvitationEntity.setContest( domain.getContest() );

        return contestInvitationEntity;
    }

    @Override
    public ContestInvitation toDomain(ContestInvitationEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ContestInvitation contestInvitation = new ContestInvitation();

        contestInvitation.setUser( entity.getUser() );
        contestInvitation.setContest( entity.getContest() );

        return contestInvitation;
    }
}
