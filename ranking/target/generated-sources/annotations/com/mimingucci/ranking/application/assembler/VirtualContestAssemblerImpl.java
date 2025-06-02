package com.mimingucci.ranking.application.assembler;

import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-03T04:14:50+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Amazon.com Inc.)"
)
@Component
public class VirtualContestAssemblerImpl implements VirtualContestAssembler {

    @Override
    public VirtualContestMetadata toVirtual(VirtualContestRequest request) {
        if ( request == null ) {
            return null;
        }

        VirtualContestMetadata virtualContestMetadata = new VirtualContestMetadata();

        virtualContestMetadata.setId( request.getId() );
        virtualContestMetadata.setContest( request.getContest() );
        virtualContestMetadata.setUser( request.getUser() );
        virtualContestMetadata.setStartTime( request.getStartTime() );
        virtualContestMetadata.setEndTime( request.getEndTime() );
        virtualContestMetadata.setActualStartTime( request.getActualStartTime() );
        virtualContestMetadata.setActualEndTime( request.getActualEndTime() );
        virtualContestMetadata.setContestants( request.getContestants() );
        virtualContestMetadata.setProblemset( request.getProblemset() );

        return virtualContestMetadata;
    }
}
