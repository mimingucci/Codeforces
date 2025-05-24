package com.mimingucci.ranking.domain.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.common.exception.ApiRequestException;
import com.mimingucci.ranking.domain.model.LeaderboardUpdate;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.jar.Manifest;

@Service
public class LeaderboardService {
    private final JedisPool jedisPool;

    private final LeaderboardEntryRepository repository;

    public LeaderboardService(
            @Value("${redis.host}") String redisHost,
            @Value("${redis.port}") int redisPort,
            LeaderboardEntryRepository repository
            ) {
        this.repository = repository;
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
        return "leaderboard:" + contestId;
    }
    private String getVirtualKey(Long contestId) {
        return "virtual-leaderboard:" + contestId;
    }

    public LeaderboardUpdate getLeaderboardByContestId(Long contestId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(getKey(contestId));
            if (json == null) {
                return new LeaderboardUpdate(contestId, repository.getAllEntriesByContestId(contestId));
            }
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

            return mapper.readValue(json, LeaderboardUpdate.class);
        } catch (Exception e) {
            throw new ApiRequestException("Failed to fetch leaderboard for contest: " + contestId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public LeaderboardUpdate getVirtualLeaderboardByContestId(Long contestId) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(getVirtualKey(contestId));
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

            return mapper.readValue(json, LeaderboardUpdate.class);
        } catch (Exception e) {
            throw new ApiRequestException("Failed to fetch leaderboard for contest: " + contestId, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
