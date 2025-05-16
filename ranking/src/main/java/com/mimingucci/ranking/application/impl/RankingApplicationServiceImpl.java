package com.mimingucci.ranking.application.impl;

import com.mimingucci.ranking.application.RankingApplicationService;
import com.mimingucci.ranking.application.assembler.VirtualContestAssembler;
import com.mimingucci.ranking.common.constant.ErrorMessageConstants;
import com.mimingucci.ranking.common.exception.ApiRequestException;
import com.mimingucci.ranking.common.util.JwtUtil;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.domain.repository.RatingChangeRepository;
import com.mimingucci.ranking.domain.service.LeaderboardService;
import com.mimingucci.ranking.domain.service.RatingCalculator;
import com.mimingucci.ranking.domain.service.VirtualContestService;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingApplicationServiceImpl implements RankingApplicationService {
    private final VirtualContestService virtualContestService;

    private final RatingCalculator ratingCalculator;

    private final RatingChangeRepository ratingChangeRepository;

    private final LeaderboardService leaderboardService;

    private final JwtUtil jwtUtil;

    @Override
    public List<LeaderboardEntry> getLeaderboard(Long contestId) {
        return leaderboardService.getLeaderboardByContestId(contestId).getEntries();
    }

    @Override
    public VirtualContestMetadata startVirtual(VirtualContestRequest request, String token) {
        Long author = null;
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String auth = token.substring(7); // Remove "Bearer " prefix
                Claims claims = this.jwtUtil.extractAllClaims(auth);
                author = claims.get("id", Long.class);
                request.setUserId(author);
            } else {
                throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        this.virtualContestService.scheduleVirtualContest(VirtualContestAssembler.INSTANCE.toVirtual(request));
        return VirtualContestAssembler.INSTANCE.toVirtual(request);
    }

    @Override
    public Boolean completeContest(Long contestId, String token) {
        if (token == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        try {
            Claims claims = this.jwtUtil.validateToken(token);
            if (!claims.getSubject().equals("SYSTEM")) return false;
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return ratingCalculator.completeContest(contestId);
    }

    @Override
    public List<RatingChange> getHistoryRatingChanges(Long userId) {
        return ratingChangeRepository.getByUser(userId);
    }
}
