package com.mimingucci.ranking.common.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
public class SubmissionHistoryFileHandler {
    private static final String BASE_DIR = "src/main/resources/templates/submission_history/";
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

    public static void writeSubmissionHistory(Long contestId, List<SubmissionResultEvent> events) {
        try {
            String fileName = getFileName(contestId);
            Path filePath = Paths.get(fileName);
            mapper.writeValue(filePath.toFile(), events);
            log.info("Successfully wrote submission history for contest {} to file {}", contestId, fileName);
        } catch (IOException e) {
            log.error("Failed to write submission history for contest " + contestId, e);
        }
    }

    public static List<SubmissionResultEvent> readSubmissionHistory(Long contestId) {
        try {
            String fileName = getFileName(contestId);
            Path filePath = Paths.get(fileName);
            if (!Files.exists(filePath)) {
                log.warn("No submission history file found for contest {}", contestId);
                return List.of();
            }
            return mapper.readValue(
                    filePath.toFile(),
                    new TypeReference<List<SubmissionResultEvent>>() {}
            );
        } catch (IOException e) {
            log.error("Failed to read submission history for contest " + contestId, e);
            return List.of();
        }
    }

    public static boolean deleteSubmissionHistory(Long contestId) {
        try {
            Path filePath = Paths.get(getFileName(contestId));
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Failed to delete submission history for contest " + contestId, e);
            return false;
        }
    }

    /**
     * Check if submission history file exists for a given contest
     * @param contestId the contest ID to check
     * @return true if file exists, false otherwise
     */
    public static boolean submissionHistoryFileExists(Long contestId) {
        try {
            Path filePath = Paths.get(getFileName(contestId));
            return Files.exists(filePath);
        } catch (Exception e) {
            log.error("Error checking submission history file existence for contest {}", contestId, e);
            return false;
        }
    }

    private static String getFileName(Long contestId) {
        return BASE_DIR + "contest_" + contestId + "_history.json";
    }
}
