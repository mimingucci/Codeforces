package com.mimingucci.leaderboard;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import redis.clients.jedis.Jedis;

public class LeaderboardFetcher {
    public static void main(String[] args) throws Exception {
        String redisHost = "localhost";
        int redisPort = 6379;
        String key = "leaderboard4"; // adjust to your contestId

        try (Jedis jedis = new Jedis(redisHost, redisPort)) {
            String json = jedis.get(key);
            if (json == null) {
                System.out.println("No leaderboard found for key: " + key);
                return;
            }

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

            LeaderboardUpdate leaderboard = mapper.readValue(json, LeaderboardUpdate.class);

            // Print it nicely
            System.out.println("Contest ID: " + leaderboard.getContestId());
            for (LeaderboardEntry entry : leaderboard.getEntries()) {
                System.out.println("User: " + entry.getUserId() + ", Score: " + entry.getTotalScore() +
                        ", Rank: " + entry.getRank() + ", Penalty: " + entry.getPenalty());
            }
        }
    }
}
