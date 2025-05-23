package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-18T23:38:11+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Amazon.com Inc.)"
)
@Component
public class RatingChangeConverterImpl implements RatingChangeConverter {

    @Override
    public RatingChange toDomain(RatingChangeEntity entity) {
        if ( entity == null ) {
            return null;
        }

        RatingChange ratingChange = new RatingChange();

        ratingChange.setUser( entity.getUser() );
        ratingChange.setContest( entity.getContest() );
        ratingChange.setSolvedProblem( entity.getSolvedProblem() );
        ratingChange.setRank( entity.getRank() );
        ratingChange.setOldRating( entity.getOldRating() );
        ratingChange.setNewRating( entity.getNewRating() );
        ratingChange.setRatingChange( entity.getRatingChange() );

        return ratingChange;
    }

    @Override
    public RatingChangeEntity toEntity(RatingChange domain) {
        if ( domain == null ) {
            return null;
        }

        RatingChangeEntity ratingChangeEntity = new RatingChangeEntity();

        ratingChangeEntity.setUser( domain.getUser() );
        ratingChangeEntity.setContest( domain.getContest() );
        ratingChangeEntity.setSolvedProblem( domain.getSolvedProblem() );
        ratingChangeEntity.setRank( domain.getRank() );
        ratingChangeEntity.setOldRating( domain.getOldRating() );
        ratingChangeEntity.setNewRating( domain.getNewRating() );
        ratingChangeEntity.setRatingChange( domain.getRatingChange() );

        return ratingChangeEntity;
    }
}
