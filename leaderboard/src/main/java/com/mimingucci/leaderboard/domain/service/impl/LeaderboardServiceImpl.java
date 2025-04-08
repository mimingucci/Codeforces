package com.mimingucci.leaderboard.domain.service.impl;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.leaderboard.common.exception.ApiRequestException;
import com.mimingucci.leaderboard.domain.model.LeaderboardEntry;
import com.mimingucci.leaderboard.domain.model.LeaderboardUpdate;
import com.mimingucci.leaderboard.domain.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;

@Service
public class LeaderboardServiceImpl implements LeaderboardService {
    private final JedisPool jedisPool;

    public LeaderboardServiceImpl(
            @Value("${redis.host}") String redisHost,
            @Value("${redis.port}") int redisPort) {

        this.jedisPool = new JedisPool(buildPoolConfig(), redisHost, redisPort);
    }

    private JedisPoolConfig buildPoolConfig() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(10);
        poolConfig.setMaxIdle(5);
        poolConfig.setMinIdle(1);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        return poolConfig;
    }

    private String getKey(Long contestId) {
        return "leaderboard" + contestId;
    }

    @Override
    public LeaderboardUpdate getLeaderboardByContestId(Long contestId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(getKey(contestId));
            if (json == null) {
                return null;
            }
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

            return mapper.readValue(json, LeaderboardUpdate.class);
        } catch (Exception e) {
            throw new ApiRequestException("Failed to fetch leaderboard for contest: " + contestId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
