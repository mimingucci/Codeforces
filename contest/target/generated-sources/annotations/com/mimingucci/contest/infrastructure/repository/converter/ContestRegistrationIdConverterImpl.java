package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ContestRegistrationIdConverterImpl implements ContestRegistrationIdConverter {

    @Override
    public ContestRegistrationId toEntity(com.mimingucci.contest.domain.model.ContestRegistrationId domain) {
        if ( domain == null ) {
            return null;
        }

        ContestRegistrationId contestRegistrationId = new ContestRegistrationId();

        contestRegistrationId.setUser( domain.getUser() );
        contestRegistrationId.setContest( domain.getContest() );

        return contestRegistrationId;
    }

    @Override
    public com.mimingucci.contest.domain.model.ContestRegistrationId toDomain(ContestRegistrationId entity) {
        if ( entity == null ) {
            return null;
        }

        com.mimingucci.contest.domain.model.ContestRegistrationId contestRegistrationId = new com.mimingucci.contest.domain.model.ContestRegistrationId();

        contestRegistrationId.setUser( entity.getUser() );
        contestRegistrationId.setContest( entity.getContest() );

        return contestRegistrationId;
    }
}
