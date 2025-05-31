package com.mimingucci.submission.domain.service.impl;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.common.exception.ApiRequestException;
import com.mimingucci.submission.domain.client.ContestClient;
import com.mimingucci.submission.domain.model.MossDetection;
import com.mimingucci.submission.domain.model.Submission;
import com.mimingucci.submission.domain.repository.MossDetectionRepository;
import com.mimingucci.submission.domain.repository.SubmissionRepository;
import com.mimingucci.submission.domain.service.MossService;
import com.mimingucci.submission.presentation.dto.response.ContestResponse;
import com.mimingucci.submission.presentation.dto.response.MossPlagiarismResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class MossServiceImpl implements MossService {

    private final SubmissionRepository submissionRepository;
    private final MossDetectionRepository mossDetectionRepository;
    private final ContestClient contestClient;

    @Value("${moss.script.path:/app/moss}")
    private String mossScriptPath;

    @Value("${moss.temp.dir:/tmp/moss}")
    private String mossTempDir;

    @Override
    public MossDetection detectPlagiarism(Long contestId, SubmissionLanguage language) {
        // Check if detection has already been run for this contest
        MossDetection existing = getByContestIdAndLanguage(contestId, language);
        if (existing != null) {
            if ("COMPLETED".equals(existing.getStatus())) {
                throw new ApiRequestException("Plagiarism detection has already been completed for this contest", HttpStatus.BAD_REQUEST);
            } else if ("PROCESSING".equals(existing.getStatus())) {
                throw new ApiRequestException("Plagiarism detection is currently in progress for this contest", HttpStatus.BAD_REQUEST);
            }
        }

        // Create initial detection record with PROCESSING status
        MossDetection detection = new MossDetection();
        detection.setContestId(contestId);
        detection.setLanguage(language);
        detection.setStatus("PROCESSING");
        detection.setDetectionTime(Instant.now());

        MossDetection saved = mossDetectionRepository.save(detection);

        // Start async processing
        processDetectionAsync(saved.getId(), contestId, language);

        return saved;
    }

    @Async
    public void processDetectionAsync(Long detectionId, Long contestId, SubmissionLanguage language) {
        try {
            // Get contest info
            ContestResponse contest = contestClient.getContest(contestId).data();
            if (contest == null) {
                updateDetectionStatus(detectionId, "FAILED", "Contest not found");
                return;
            }

            if (contest.getEndTime().isAfter(Instant.now())) {
                updateDetectionStatus(detectionId, "FAILED", "Contest hasn't finished yet");
                return;
            }

            // Get all accepted submissions for the contest
            List<Submission> submissions = submissionRepository.findAcceptedSubmissionsByContest(contestId, contest.getStartTime(), contest.getEndTime());

            if (submissions.size() < 2) {
                updateDetectionStatus(detectionId, "FAILED", "Not enough submissions to run plagiarism detection");
                return;
            }

            // Create temporary directory for submissions
            Path tempDir = createTempDirectory(contestId);

            // Write submissions to files
            writeSubmissionsToFiles(submissions, tempDir, language);

            // Run MOSS detection
            String mossResult = runMossDetection(tempDir, language);

            // Parse results
            String resultUrl = extractMossUrl(mossResult);

            // Update detection with results
            updateDetectionWithResults(detectionId, resultUrl, "COMPLETED");

            // Cleanup temp files
            cleanupTempDirectory(tempDir);

        } catch (Exception e) {
            log.error("Error running MOSS detection for contest {}: {}", contestId, e.getMessage());
            updateDetectionStatus(detectionId, "FAILED" , e.getMessage());
        }
    }

    private void updateDetectionStatus(Long detectionId, String status, String errorMessage) {
        MossDetection detection = mossDetectionRepository.findById(detectionId).orElse(null);
        if (detection != null) {
            detection.setStatus(status);
            if ("FAILED".equals(status)) {
                detection.setMessage(errorMessage);
            }
            mossDetectionRepository.save(detection);
        }
    }

    private void updateDetectionWithResults(Long detectionId, String resultUrl, String status) {
        MossDetection detection = mossDetectionRepository.findById(detectionId).orElse(null);
        if (detection != null) {
            detection.setResultUrl(resultUrl);
            detection.setStatus(status);
            mossDetectionRepository.save(detection);
        }
    }

    private String extractMossUrl(String mossOutput) {
        Pattern urlPattern = Pattern.compile("http://moss\\.stanford\\.edu/results/\\S+");
        Matcher matcher = urlPattern.matcher(mossOutput);
        return matcher.find() ? matcher.group() : null;
    }

    @Override
    public MossDetection getByContestIdAndLanguage(Long contestId, SubmissionLanguage language) {
        try {
            return this.mossDetectionRepository.getByContestAndLanguage(contestId, language);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<MossDetection> getAllByContestId(Long contestId) {
        return this.mossDetectionRepository.getAllByContest(contestId);
    }

    private Path createTempDirectory(Long contestId) throws IOException {
        Path tempDir = Paths.get(mossTempDir, "contest_" + contestId);
        Files.createDirectories(tempDir);
        return tempDir;
    }

    private void writeSubmissionsToFiles(List<Submission> submissions, Path tempDir, SubmissionLanguage language) throws IOException {
        String fileExtension = getFileExtension(language);

        for (Submission submission : submissions) {
            String fileName = String.format("user_%d_problem_%d_submission_%d.%s",
                    submission.getAuthor(),
                    submission.getProblem(),
                    submission.getId(),
                    fileExtension);

            Path filePath = tempDir.resolve(fileName);
            Files.write(filePath, submission.getSourceCode().getBytes());
        }
    }

    private String getFileExtension(SubmissionLanguage language) {
        return switch (language) {
            case C -> "c";
            case CPP -> "cpp";
            case JAVA -> "java";
            case PY3 -> "py";
            case JS -> "js";
            case PHP -> "php";
            case GO -> "go";
        };
    }

    private String runMossDetection(Path tempDir, SubmissionLanguage language)
            throws IOException, InterruptedException, TimeoutException {

        File[] files = tempDir.toFile().listFiles((dir, name) ->
                name.endsWith("." + getFileExtension(language)));
        if (files == null || files.length == 0) {
            throw new RuntimeException("No submission files found for MOSS.");
        }

        List<String> command = new ArrayList<>();
        command.add("/usr/bin/perl"); // Absolute path to perl
        command.add(mossScriptPath);
        command.add("-l");
        command.add(getMossName(language)); // Should return "java", "c", etc.
        command.add("-c");
        command.add("\"Contest plagiarism detection\"");
        command.add("-m");
        command.add("2");
        Arrays.stream(files).forEach(f ->
                command.add(f.getAbsolutePath()));

        ProcessBuilder pb = new ProcessBuilder(command)
                .directory(tempDir.toFile())
                .redirectErrorStream(true); // Combine stdout/stderr

        Process process = pb.start();

        // Read output with timeout
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                if (line.contains("http://moss.stanford.edu/results")) {
                    break; // Early exit when we get the URL
                }
            }
        }

        if (!process.waitFor(5, TimeUnit.MINUTES)) { // Timeout after 5 mins
            process.destroyForcibly();
            throw new TimeoutException("MOSS execution timed out");
        }

        if (process.exitValue() != 0) {
            throw new RuntimeException(
                    "MOSS failed:\n" + output.toString());
        }

        return output.toString();
    }

    private MossPlagiarismResponse parseMossResult(String mossOutput, Long contestId, SubmissionLanguage language) {
        // Extract MOSS result URL using regex
        Pattern urlPattern = Pattern.compile("http://moss\\.stanford\\.edu/results/\\S+");
        Matcher matcher = urlPattern.matcher(mossOutput);

        String resultUrl = null;
        if (matcher.find()) {
            resultUrl = matcher.group();
        }

        MossPlagiarismResponse response = new MossPlagiarismResponse();
        response.setContestId(contestId);
        response.setResultUrl(resultUrl);
        response.setDetectionTime(Instant.now());
        response.setLanguage(language);

        return response;
    }

    private void cleanupTempDirectory(Path tempDir) {
        try {
            Files.walk(tempDir)
                    .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete temp file: {}", path);
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to cleanup temp directory: {}", tempDir);
        }
    }

    public String getMossName(SubmissionLanguage language) {
        return switch (language) {
            case JAVA -> "java";
            case C -> "c";
            case CPP -> "cc";
            case PY3 -> "python";
            case JS -> "javascript";
            case PHP -> "php";
            case GO -> "go";
            default -> throw new IllegalArgumentException("Unsupported language");
        };
    }
}
