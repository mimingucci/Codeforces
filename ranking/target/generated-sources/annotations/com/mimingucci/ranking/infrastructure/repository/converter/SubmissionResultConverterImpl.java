package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.infrastructure.repository.entity.SubmissionResultEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-18T23:38:11+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Amazon.com Inc.)"
)
@Component
public class SubmissionResultConverterImpl implements SubmissionResultConverter {

    @Override
    public SubmissionResultEntity eventToEntity(SubmissionResultEvent event) {
        if ( event == null ) {
            return null;
        }

        SubmissionResultEntity submissionResultEntity = new SubmissionResultEntity();

        submissionResultEntity.setId( event.getId() );
        submissionResultEntity.setVerdict( event.getVerdict() );
        submissionResultEntity.setAuthor( event.getAuthor() );
        submissionResultEntity.setContest( event.getContest() );
        submissionResultEntity.setProblem( event.getProblem() );
        submissionResultEntity.setExecution_time_ms( event.getExecution_time_ms() );
        submissionResultEntity.setMemory_used_bytes( event.getMemory_used_bytes() );
        submissionResultEntity.setScore( event.getScore() );
        submissionResultEntity.setJudged_on( event.getJudged_on() );

        return submissionResultEntity;
    }

    @Override
    public SubmissionResultEvent toEvent(SubmissionResultEntity entity) {
        if ( entity == null ) {
            return null;
        }

        SubmissionResultEvent submissionResultEvent = new SubmissionResultEvent();

        submissionResultEvent.setId( entity.getId() );
        submissionResultEvent.setVerdict( entity.getVerdict() );
        submissionResultEvent.setAuthor( entity.getAuthor() );
        submissionResultEvent.setContest( entity.getContest() );
        submissionResultEvent.setProblem( entity.getProblem() );
        submissionResultEvent.setExecution_time_ms( entity.getExecution_time_ms() );
        submissionResultEvent.setMemory_used_bytes( entity.getMemory_used_bytes() );
        submissionResultEvent.setScore( entity.getScore() );
        submissionResultEvent.setJudged_on( entity.getJudged_on() );

        return submissionResultEvent;
    }
}
