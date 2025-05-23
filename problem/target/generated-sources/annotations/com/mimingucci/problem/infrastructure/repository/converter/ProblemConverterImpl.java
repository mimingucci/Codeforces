package com.mimingucci.problem.infrastructure.repository.converter;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.infrastructure.repository.entity.ProblemEntity;
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
public class ProblemConverterImpl implements ProblemConverter {

    @Override
    public Problem toDomain(ProblemEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Problem problem = new Problem();

        problem.setId( entity.getId() );
        problem.setTitle( entity.getTitle() );
        problem.setStatement( entity.getStatement() );
        problem.setAuthor( entity.getAuthor() );
        problem.setIsPublished( entity.getIsPublished() );
        problem.setSolution( entity.getSolution() );
        problem.setContest( entity.getContest() );
        problem.setTimeLimit( entity.getTimeLimit() );
        problem.setMemoryLimit( entity.getMemoryLimit() );
        List<String> list = entity.getTags();
        if ( list != null ) {
            problem.setTags( new ArrayList<String>( list ) );
        }
        problem.setRating( entity.getRating() );
        problem.setScore( entity.getScore() );
        problem.setCreatedAt( entity.getCreatedAt() );
        problem.setUpdatedAt( entity.getUpdatedAt() );

        return problem;
    }

    @Override
    public ProblemEntity toEntity(Problem domain) {
        if ( domain == null ) {
            return null;
        }

        ProblemEntity problemEntity = new ProblemEntity();

        problemEntity.setId( domain.getId() );
        problemEntity.setTitle( domain.getTitle() );
        problemEntity.setStatement( domain.getStatement() );
        problemEntity.setAuthor( domain.getAuthor() );
        problemEntity.setSolution( domain.getSolution() );
        problemEntity.setContest( domain.getContest() );
        problemEntity.setIsPublished( domain.getIsPublished() );
        problemEntity.setTimeLimit( domain.getTimeLimit() );
        problemEntity.setMemoryLimit( domain.getMemoryLimit() );
        problemEntity.setRating( domain.getRating() );
        problemEntity.setScore( domain.getScore() );
        List<String> list = domain.getTags();
        if ( list != null ) {
            problemEntity.setTags( new ArrayList<String>( list ) );
        }
        problemEntity.setCreatedAt( domain.getCreatedAt() );
        problemEntity.setUpdatedAt( domain.getUpdatedAt() );

        return problemEntity;
    }
}
