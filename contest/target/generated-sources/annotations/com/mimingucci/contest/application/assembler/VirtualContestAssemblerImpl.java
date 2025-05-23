package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.contest.presentation.dto.response.VirtualContestResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T21:45:42+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class VirtualContestAssemblerImpl implements VirtualContestAssembler {

    @Override
    public VirtualContest toDomain(VirtualContestRequest request) {
        if ( request == null ) {
            return null;
        }

        VirtualContest virtualContest = new VirtualContest();

        virtualContest.setContest( request.getContest() );
        virtualContest.setUser( request.getUser() );
        virtualContest.setStartTime( request.getStartTime() );

        return virtualContest;
    }

    @Override
    public VirtualContestResponse toResponse(VirtualContest domain) {
        if ( domain == null ) {
            return null;
        }

        VirtualContestResponse virtualContestResponse = new VirtualContestResponse();

        virtualContestResponse.setId( domain.getId() );
        virtualContestResponse.setUser( domain.getUser() );
        virtualContestResponse.setContest( domain.getContest() );
        virtualContestResponse.setStartTime( domain.getStartTime() );
        virtualContestResponse.setEndTime( domain.getEndTime() );
        virtualContestResponse.setActualStartTime( domain.getActualStartTime() );
        virtualContestResponse.setActualEndTime( domain.getActualEndTime() );

        return virtualContestResponse;
    }
}
