package com.mimingucci.contest.application.assembler;

import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.presentation.dto.request.ContestCreateRequest;
import com.mimingucci.contest.presentation.dto.request.ContestUpdateRequest;
import com.mimingucci.contest.presentation.dto.response.ContestResponse;
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
public class ContestAssemblerImpl implements ContestAssembler {

    @Override
    public Contest createToDomain(ContestCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Contest contest = new Contest();

        contest.setName( request.getName() );
        contest.setStartTime( request.getStartTime() );
        contest.setEndTime( request.getEndTime() );
        contest.setAuthors( longArrayToLongSet( request.getAuthors() ) );
        contest.setTesters( longArrayToLongSet( request.getTesters() ) );
        contest.setCoordinators( longArrayToLongSet( request.getCoordinators() ) );
        contest.setEnabled( request.getEnabled() );
        contest.setType( request.getType() );
        contest.setCreatedBy( request.getCreatedBy() );
        contest.setIsPublic( request.getIsPublic() );

        return contest;
    }

    @Override
    public Contest updateToDomain(ContestUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        Contest contest = new Contest();

        contest.setName( request.getName() );
        contest.setStartTime( request.getStartTime() );
        contest.setEndTime( request.getEndTime() );
        contest.setAuthors( longArrayToLongSet( request.getAuthors() ) );
        contest.setTesters( longArrayToLongSet( request.getTesters() ) );
        contest.setCoordinators( longArrayToLongSet( request.getCoordinators() ) );
        contest.setEnabled( request.getEnabled() );
        contest.setType( request.getType() );
        contest.setIsPublic( request.getIsPublic() );

        return contest;
    }

    @Override
    public ContestResponse domainToResponse(Contest domain) {
        if ( domain == null ) {
            return null;
        }

        ContestResponse contestResponse = new ContestResponse();

        contestResponse.setId( domain.getId() );
        contestResponse.setName( domain.getName() );
        contestResponse.setStartTime( domain.getStartTime() );
        contestResponse.setEndTime( domain.getEndTime() );
        Set<Long> set = domain.getAuthors();
        if ( set != null ) {
            contestResponse.setAuthors( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getTesters();
        if ( set1 != null ) {
            contestResponse.setTesters( new LinkedHashSet<Long>( set1 ) );
        }
        Set<Long> set2 = domain.getCoordinators();
        if ( set2 != null ) {
            contestResponse.setCoordinators( new LinkedHashSet<Long>( set2 ) );
        }
        contestResponse.setEnabled( domain.getEnabled() );
        contestResponse.setIsPublic( domain.getIsPublic() );
        contestResponse.setType( domain.getType() );
        contestResponse.setCreatedBy( domain.getCreatedBy() );

        return contestResponse;
    }

    protected Set<Long> longArrayToLongSet(Long[] longArray) {
        if ( longArray == null ) {
            return null;
        }

        Set<Long> set = LinkedHashSet.newLinkedHashSet( longArray.length );
        for ( Long long1 : longArray ) {
            set.add( long1 );
        }

        return set;
    }
}
