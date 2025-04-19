package com.mimingucci.ranking.common.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
public class LeaderboardFileHandler {
    private static final String BASE_DIR = "src/main/resources/templates/leaderboard/";
    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    static {
        try {
            Path directory = Paths.get(BASE_DIR);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
                log.info("Created directory: {}", directory);
            }
        } catch (IOException e) {
            log.error("Failed to create directory: " + BASE_DIR, e);
        }
    }

    public static void writeLeaderboard(Long contestId, List<LeaderboardEntry> entries) {
        try {
            String fileName = getFileName(contestId);
            Path filePath = Paths.get(fileName);
            mapper.writeValue(filePath.toFile(), entries);
            log.info("Successfully wrote leaderboard for contest {} to file {}", contestId, fileName);
        } catch (IOException e) {
            log.error("Failed to write leaderboard for contest " + contestId, e);
        }
    }

    public static List<LeaderboardEntry> readLeaderboard(Long contestId) {
        try {
            String fileName = getFileName(contestId);
            Path filePath = Paths.get(fileName);
            if (!Files.exists(filePath)) {
                log.warn("No leaderboard file found for contest {}", contestId);
                return List.of();
            }
            return mapper.readValue(filePath.toFile(), 
                mapper.getTypeFactory().constructCollectionType(List.class, LeaderboardEntry.class));
        } catch (IOException e) {
            log.error("Failed to read leaderboard for contest " + contestId, e);
            return List.of();
        }
    }

    private static String getFileName(Long contestId) {
        return BASE_DIR + "contest_" + contestId + "_leaderboard.json";
    }
}