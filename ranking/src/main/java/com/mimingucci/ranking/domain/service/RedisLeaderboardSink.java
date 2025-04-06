package com.mimingucci.ranking.domain.service;

import com.google.gson.Gson;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.LeaderboardUpdate;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;
import redis.clients.jedis.Jedis;

public class RedisLeaderboardSink extends RichSinkFunction<LeaderboardUpdate> {
    private final String host;
    private final int port;
    private final String keyPrefix;
    private transient Jedis jedis;

    public RedisLeaderboardSink(String host, int port, String keyPrefix) {
        this.host = host;
        this.port = port;
        this.keyPrefix = keyPrefix;
    }

    @Override
    public void open(Configuration parameters) {
        this.jedis = new Jedis(host, port);
    }

    @Override
    public void invoke(LeaderboardUpdate update, Context context) {
        String key = keyPrefix + update.getContestId();

        // Clear previous values
        jedis.del(key);

        // Add all entries to Redis sorted set
        for (LeaderboardEntry entry : update.getEntries()) {
            jedis.zadd(key, entry.getRank(), serializeEntry(entry));
        }

        // Set expiration if needed
        jedis.expire(key, 86400); // Expire after 24 hours
    }

    private String serializeEntry(LeaderboardEntry entry) {
        // Convert to JSON or your preferred format
        return new Gson().toJson(entry);
    }

    @Override
    public void close() throws Exception {
        if (jedis != null) {
            jedis.close();
        }
    }
}
