package com.mimingucci.ranking.application.impl;

import com.mimingucci.ranking.application.RankingApplicationService;
import com.mimingucci.ranking.application.assembler.VirtualContestAssembler;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.domain.service.VirtualContestService;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingApplicationServiceImpl implements RankingApplicationService {
    private final VirtualContestService virtualContestService;

    @Override
    public List<LeaderboardEntry> getLeaderboard(Long contestId) {
        return List.of();
    }

    @Override
    public VirtualContestMetadata startVirtual(VirtualContestRequest request) {
        this.virtualContestService.scheduleVirtualContest(VirtualContestAssembler.INSTANCE.toVirtual(request));
        return VirtualContestAssembler.INSTANCE.toVirtual(request);
    }
}
