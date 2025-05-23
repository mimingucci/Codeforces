package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.presentation.dto.request.ContestRegistrationDto;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ContestRegistrationAssemblerImpl implements ContestRegistrationAssembler {

    @Override
    public ContestRegistration toDomain(ContestRegistrationDto dto) {
        if ( dto == null ) {
            return null;
        }

        ContestRegistration contestRegistration = new ContestRegistration();

        contestRegistration.setUser( dto.getUser() );
        contestRegistration.setContest( dto.getContest() );
        contestRegistration.setRated( dto.getRated() );
        contestRegistration.setParticipated( dto.getParticipated() );

        return contestRegistration;
    }

    @Override
    public ContestRegistrationDto toResponse(ContestRegistration domain) {
        if ( domain == null ) {
            return null;
        }

        ContestRegistrationDto contestRegistrationDto = new ContestRegistrationDto();

        contestRegistrationDto.setUser( domain.getUser() );
        contestRegistrationDto.setContest( domain.getContest() );
        contestRegistrationDto.setRated( domain.getRated() );
        contestRegistrationDto.setParticipated( domain.getParticipated() );

        return contestRegistrationDto;
    }
}
