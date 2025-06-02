package com.mimingucci.ranking.infrastructure.repository.converter;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.infrastructure.repository.entity.LeaderboardEntryEntity;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-03T04:14:50+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.15 (Amazon.com Inc.)"
)
@Component
public class LeaderboardEntryConverterImpl implements LeaderboardEntryConverter {

    @Override
    public LeaderboardEntryEntity entryToEntity(LeaderboardEntry entry) {
        if ( entry == null ) {
            return null;
        }

        LeaderboardEntryEntity leaderboardEntryEntity = new LeaderboardEntryEntity();

        leaderboardEntryEntity.setUserId( entry.getUserId() );
        leaderboardEntryEntity.setContestId( entry.getContestId() );
        leaderboardEntryEntity.setRank( entry.getRank() );
        leaderboardEntryEntity.setTotalScore( entry.getTotalScore() );
        leaderboardEntryEntity.setPenalty( entry.getPenalty() );
        leaderboardEntryEntity.setRated( entry.getRated() );
        Set<Long> set = entry.getSolvedProblems();
        if ( set != null ) {
            leaderboardEntryEntity.setSolvedProblems( new LinkedHashSet<Long>( set ) );
        }
        Map<Long, Integer> map = entry.getProblemAttempts();
        if ( map != null ) {
            leaderboardEntryEntity.setProblemAttempts( new LinkedHashMap<Long, Integer>( map ) );
        }
        Map<Long, Integer> map1 = entry.getProblemScores();
        if ( map1 != null ) {
            leaderboardEntryEntity.setProblemScores( new LinkedHashMap<Long, Integer>( map1 ) );
        }
        Map<Long, Integer> map2 = entry.getProblemSolveTimes();
        if ( map2 != null ) {
            leaderboardEntryEntity.setProblemSolveTimes( new LinkedHashMap<Long, Integer>( map2 ) );
        }

        return leaderboardEntryEntity;
    }

    @Override
    public LeaderboardEntry toDomain(LeaderboardEntryEntity entity) {
        if ( entity == null ) {
            return null;
        }

        LeaderboardEntry leaderboardEntry = new LeaderboardEntry();

        leaderboardEntry.setUserId( entity.getUserId() );
        leaderboardEntry.setContestId( entity.getContestId() );
        leaderboardEntry.setRank( entity.getRank() );
        leaderboardEntry.setTotalScore( entity.getTotalScore() );
        leaderboardEntry.setPenalty( entity.getPenalty() );
        leaderboardEntry.setRated( entity.getRated() );
        Set<Long> set = entity.getSolvedProblems();
        if ( set != null ) {
            leaderboardEntry.setSolvedProblems( new LinkedHashSet<Long>( set ) );
        }
        Map<Long, Integer> map = entity.getProblemAttempts();
        if ( map != null ) {
            leaderboardEntry.setProblemAttempts( new LinkedHashMap<Long, Integer>( map ) );
        }
        Map<Long, Integer> map1 = entity.getProblemScores();
        if ( map1 != null ) {
            leaderboardEntry.setProblemScores( new LinkedHashMap<Long, Integer>( map1 ) );
        }
        Map<Long, Integer> map2 = entity.getProblemSolveTimes();
        if ( map2 != null ) {
            leaderboardEntry.setProblemSolveTimes( new LinkedHashMap<Long, Integer>( map2 ) );
        }

        return leaderboardEntry;
    }
}
