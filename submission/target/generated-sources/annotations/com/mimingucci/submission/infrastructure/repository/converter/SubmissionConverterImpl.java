package com.mimingucci.submission.infrastructure.repository.converter;

import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-31T20:11:05+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class SubmissionConverterImpl implements SubmissionConverter {

    @Override
    public Submission toDomain(SubmissionEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Submission submission = new Submission();

        submission.setId( entity.getId() );
        submission.setAuthor( entity.getAuthor() );
        submission.setProblem( entity.getProblem() );
        submission.setContest( entity.getContest() );
        submission.setExecution_time_ms( entity.getExecution_time_ms() );
        submission.setMemory_used_bytes( entity.getMemory_used_bytes() );
        submission.setSourceCode( entity.getSourceCode() );
        submission.setVerdict( entity.getVerdict() );
        submission.setSent( entity.getSent() );
        submission.setJudged( entity.getJudged() );
        submission.setLanguage( entity.getLanguage() );

        return submission;
    }

    @Override
    public SubmissionEntity toEntity(Submission submission) {
        if ( submission == null ) {
            return null;
        }

        SubmissionEntity submissionEntity = new SubmissionEntity();

        submissionEntity.setId( submission.getId() );
        submissionEntity.setAuthor( submission.getAuthor() );
        submissionEntity.setProblem( submission.getProblem() );
        submissionEntity.setContest( submission.getContest() );
        submissionEntity.setVerdict( submission.getVerdict() );
        submissionEntity.setSent( submission.getSent() );
        submissionEntity.setJudged( submission.getJudged() );
        submissionEntity.setExecution_time_ms( submission.getExecution_time_ms() );
        submissionEntity.setMemory_used_bytes( submission.getMemory_used_bytes() );
        submissionEntity.setLanguage( submission.getLanguage() );
        submissionEntity.setSourceCode( submission.getSourceCode() );

        return submissionEntity;
    }
}
