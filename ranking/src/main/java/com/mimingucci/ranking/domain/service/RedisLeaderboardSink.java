package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.domain.model.LeaderboardUpdateSerializable;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;
import redis.clients.jedis.Jedis;

public class RedisLeaderboardSink extends RichSinkFunction<LeaderboardUpdateSerializable> {
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
    public void invoke(LeaderboardUpdateSerializable update, Context context) {
        String key = keyPrefix + update.getContestId();

        // Clear previous values
        jedis.del(key);

        // Store as plain string value
        jedis.set(key, update.getData());

        // Set expiration if needed
        jedis.expire(key, 86400); // Expire after 24 hours
    }

    @Override
    public void close() throws Exception {
        if (jedis != null) {
            jedis.close();
        }
    }
}
