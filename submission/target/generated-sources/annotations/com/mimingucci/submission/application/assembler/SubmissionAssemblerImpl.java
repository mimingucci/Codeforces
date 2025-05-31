package com.mimingucci.submission.application.assembler;

import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.request.VirtualSubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.SubmissionGridResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-31T20:11:05+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class SubmissionAssemblerImpl implements SubmissionAssembler {

    @Override
    public Submission toDomain(SubmissionRequest request) {
        if ( request == null ) {
            return null;
        }

        Submission submission = new Submission();

        submission.setId( request.getId() );
        submission.setAuthor( request.getAuthor() );
        submission.setProblem( request.getProblem() );
        submission.setContest( request.getContest() );
        submission.setSourceCode( request.getSourceCode() );
        submission.setLanguage( request.getLanguage() );

        return submission;
    }

    @Override
    public Submission toDomainFromVirtual(VirtualSubmissionRequest request) {
        if ( request == null ) {
            return null;
        }

        Submission submission = new Submission();

        submission.setId( request.getId() );
        submission.setAuthor( request.getAuthor() );
        submission.setProblem( request.getProblem() );
        submission.setContest( request.getContest() );
        submission.setSourceCode( request.getSourceCode() );
        submission.setLanguage( request.getLanguage() );

        return submission;
    }

    @Override
    public SubmissionResponse toResponse(Submission submission) {
        if ( submission == null ) {
            return null;
        }

        SubmissionResponse submissionResponse = new SubmissionResponse();

        submissionResponse.setId( submission.getId() );
        submissionResponse.setProblem( submission.getProblem() );
        submissionResponse.setContest( submission.getContest() );
        submissionResponse.setAuthor( submission.getAuthor() );
        submissionResponse.setSourceCode( submission.getSourceCode() );
        submissionResponse.setVerdict( submission.getVerdict() );
        submissionResponse.setLanguage( submission.getLanguage() );
        submissionResponse.setSent( submission.getSent() );
        submissionResponse.setJudged( submission.getJudged() );
        submissionResponse.setExecution_time_ms( submission.getExecution_time_ms() );
        submissionResponse.setMemory_used_bytes( submission.getMemory_used_bytes() );

        return submissionResponse;
    }

    @Override
    public SubmissionGridResponse toGrid(Submission submission) {
        if ( submission == null ) {
            return null;
        }

        SubmissionGridResponse submissionGridResponse = new SubmissionGridResponse();

        submissionGridResponse.setVerdict( submission.getVerdict() );
        submissionGridResponse.setSent( submission.getSent() );

        return submissionGridResponse;
    }
}
