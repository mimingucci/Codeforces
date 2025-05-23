package com.mimingucci.problem.application.assembler;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.presentation.dto.request.ProblemCreateRequest;
import com.mimingucci.problem.presentation.dto.request.ProblemUpdateRequest;
import com.mimingucci.problem.presentation.dto.response.ProblemResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-17T17:53:05+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ProblemAssemblerImpl implements ProblemAssembler {

    @Override
    public ProblemResponse domainToResponse(Problem domain) {
        if ( domain == null ) {
            return null;
        }

        ProblemResponse problemResponse = new ProblemResponse();

        problemResponse.setId( domain.getId() );
        problemResponse.setTitle( domain.getTitle() );
        problemResponse.setStatement( domain.getStatement() );
        problemResponse.setIsPublished( domain.getIsPublished() );
        problemResponse.setAuthor( domain.getAuthor() );
        problemResponse.setSolution( domain.getSolution() );
        problemResponse.setContest( domain.getContest() );
        problemResponse.setTimeLimit( domain.getTimeLimit() );
        problemResponse.setMemoryLimit( domain.getMemoryLimit() );
        List<String> list = domain.getTags();
        if ( list != null ) {
            problemResponse.setTags( new ArrayList<String>( list ) );
        }
        problemResponse.setRating( domain.getRating() );
        problemResponse.setScore( domain.getScore() );

        return problemResponse;
    }

    @Override
    public Problem createToDomain(ProblemCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Problem problem = new Problem();

        problem.setTitle( request.getTitle() );
        problem.setStatement( request.getStatement() );
        problem.setAuthor( request.getAuthor() );
        problem.setSolution( request.getSolution() );
        problem.setContest( request.getContest() );
        problem.setTimeLimit( request.getTimeLimit() );
        problem.setMemoryLimit( request.getMemoryLimit() );
        List<String> list = request.getTags();
        if ( list != null ) {
            problem.setTags( new ArrayList<String>( list ) );
        }
        problem.setRating( request.getRating() );
        problem.setScore( request.getScore() );

        return problem;
    }

    @Override
    public Problem updateToDomain(ProblemUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        Problem problem = new Problem();

        problem.setTitle( request.getTitle() );
        problem.setStatement( request.getStatement() );
        problem.setIsPublished( request.getIsPublished() );
        problem.setSolution( request.getSolution() );
        problem.setContest( request.getContest() );
        problem.setTimeLimit( request.getTimeLimit() );
        problem.setMemoryLimit( request.getMemoryLimit() );
        List<String> list = request.getTags();
        if ( list != null ) {
            problem.setTags( new ArrayList<String>( list ) );
        }
        problem.setRating( request.getRating() );
        problem.setScore( request.getScore() );

        return problem;
    }
}
