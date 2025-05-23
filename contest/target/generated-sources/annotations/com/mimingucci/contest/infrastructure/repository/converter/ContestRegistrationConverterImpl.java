package com.mimingucci.contest.infrastructure.repository.converter;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ContestRegistrationConverterImpl implements ContestRegistrationConverter {

    @Override
    public ContestRegistrationEntity toEntity(ContestRegistration domain) {
        if ( domain == null ) {
            return null;
        }

        ContestRegistrationEntity contestRegistrationEntity = new ContestRegistrationEntity();

        contestRegistrationEntity.setUser( domain.getUser() );
        contestRegistrationEntity.setContest( domain.getContest() );
        contestRegistrationEntity.setRated( domain.getRated() );
        contestRegistrationEntity.setParticipated( domain.getParticipated() );

        return contestRegistrationEntity;
    }

    @Override
    public ContestRegistration toDomain(ContestRegistrationEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ContestRegistration contestRegistration = new ContestRegistration();

        contestRegistration.setUser( entity.getUser() );
        contestRegistration.setContest( entity.getContest() );
        contestRegistration.setRated( entity.getRated() );
        contestRegistration.setParticipated( entity.getParticipated() );

        return contestRegistration;
    }
}
