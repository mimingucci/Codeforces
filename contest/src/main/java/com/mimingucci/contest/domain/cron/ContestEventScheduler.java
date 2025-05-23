package com.mimingucci.contest.domain.cron;

import com.mimingucci.contest.common.constant.ErrorMessageConstants;
import com.mimingucci.contest.common.enums.ContestEvent;
import com.mimingucci.contest.common.exception.ApiRequestException;
import com.mimingucci.contest.common.util.ContestantsConverter;
import com.mimingucci.contest.domain.client.ProblemClient;
import com.mimingucci.contest.domain.client.RankingClient;
import com.mimingucci.contest.domain.client.request.ProblemUpdateRequest;
import com.mimingucci.contest.domain.client.request.VirtualContestRequest;
import com.mimingucci.contest.domain.client.response.ProblemResponse;
import com.mimingucci.contest.domain.event.*;
import com.mimingucci.contest.domain.model.Contest;
import com.mimingucci.contest.domain.model.ContestRegistration;
import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.domain.repository.ContestRepository;
import com.mimingucci.contest.domain.service.ContestRegistrationService;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.stream.Collectors;

@Component
public class ContestEventScheduler {
    private static final Logger logger = LoggerFactory.getLogger(ContestEventScheduler.class);

    private final ContestRepository contestRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final TaskScheduler taskScheduler;
    private final ContestEventSchedulerProperties properties;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ProblemClient problemClient;
    private final RankingClient rankingClient;
    private final ContestRegistrationService registrationService;

    // In-memory collections to store contests and scheduled tasks
    private final Map<Long, Contest> contestsById = new ConcurrentHashMap<>();

    // Additional maps to organize contests by start and end times for more efficient lookups
    private final Map<Instant, List<Contest>> contestsByStartTime = new ConcurrentHashMap<>();
    private final Map<Instant, List<Contest>> contestsByEndTime = new ConcurrentHashMap<>();

    private final Set<ScheduledFuture<?>> scheduledTasks = ConcurrentHashMap.newKeySet();

    // Track contests that have already had their events published to avoid duplicates
    private final Set<Long> publishedStartEvents = ConcurrentHashMap.newKeySet();
    private final Set<Long> publishedEndEvents = ConcurrentHashMap.newKeySet();

    @Autowired
    public ContestEventScheduler(
            ContestRepository contestRepository,
            ApplicationEventPublisher eventPublisher,
            TaskScheduler taskScheduler,
            ContestEventSchedulerProperties properties,
            KafkaTemplate<String, Object> kafkaTemplate,
            ProblemClient problemClient,
            RankingClient rankingClient,
            ContestRegistrationService registrationService) {
        this.contestRepository = contestRepository;
        this.eventPublisher = eventPublisher;
        this.taskScheduler = taskScheduler;
        this.properties = properties;
        this.kafkaTemplate = kafkaTemplate;
        this.problemClient = problemClient;
        this.rankingClient = rankingClient;
        this.registrationService = registrationService;
    }

    @PostConstruct
    public void init() {
        // Schedule the configured fetch times
        scheduleConfiguredFetches();

        // Initial load of contests if configured to fetch on startup
        if (properties.isFetchOnStartup()) {
            logger.info("Performing initial contest cache refresh on startup");
            refreshContestsCache();
        }
    }

    private void scheduleConfiguredFetches() {
        // Schedule all the configured fetch times
        for (String cronExpression : properties.getFetchCronExpressions()) {
            try {
                CronTrigger trigger = new CronTrigger(cronExpression);
                taskScheduler.schedule(this::refreshContestsCache, trigger);
                logger.info("Scheduled contest cache refresh with cron: {}", cronExpression);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid cron expression: {}", cronExpression, e);
            }
        }
    }

    /**
     * Refreshes the in-memory cache with contests for the configured look-ahead period
     * This method can be called programmatically if needed
     */
    public synchronized void refreshContestsCache() {
        ZonedDateTime fetchTime = ZonedDateTime.now(ZoneOffset.UTC);
        logger.info("Refreshing contest cache at {}", fetchTime);

        // Clear previous scheduled tasks
        clearScheduledTasks();

        // Clear previous cache
        contestsById.clear();
        contestsByStartTime.clear();
        contestsByEndTime.clear();

        // Get current time in UTC
        Instant now = Instant.now();

        // Calculate the end of the look-ahead period
        LocalDate endDate = LocalDate.now(ZoneOffset.UTC).plusDays(properties.getMaxLookAheadDays());
        Instant periodEnd = endDate.atStartOfDay(ZoneOffset.UTC).toInstant();

        // Fetch contests that:
        // 1. Will start in the look-ahead period
        // 2. Will end in the look-ahead period
        // 3. Will be running during the look-ahead period (started before and ending after)
        List<Contest> relevantContests = contestRepository.findContestsRelevantForPeriod(
                now, periodEnd);

        logger.info("Loaded {} contests relevant for the next {} days",
                relevantContests.size(), properties.getMaxLookAheadDays());

        // Store contests in memory and schedule events
        for (Contest contest : relevantContests) {
            addContestToCache(contest);
            scheduleContestEvents(contest);
        }

        // Log the next scheduled contests
        logUpcomingContests();
    }

    /**
     * Helper method to add a contest to all cache maps
     */
    private void addContestToCache(Contest contest) {
        // Add to primary ID-based map
        contestsById.put(contest.getId(), contest);

        // Add to start time map
        Instant startTime = contest.getStartTime();
        contestsByStartTime.computeIfAbsent(startTime, k -> new ArrayList<>()).add(contest);

        // Add to end time map
        Instant endTime = contest.getEndTime();
        contestsByEndTime.computeIfAbsent(endTime, k -> new ArrayList<>()).add(contest);
    }

    /**
     * Helper method to remove a contest from all cache maps
     */
    private void removeContestFromAllCaches(Long contestId) {
        Contest contest = contestsById.remove(contestId);
        if (contest != null) {
            // Remove from start time map
            Instant startTime = contest.getStartTime();
            List<Contest> startsAtSameTime = contestsByStartTime.get(startTime);
            if (startsAtSameTime != null) {
                startsAtSameTime.removeIf(c -> c.getId().equals(contestId));
                if (startsAtSameTime.isEmpty()) {
                    contestsByStartTime.remove(startTime);
                }
            }

            // Remove from end time map
            Instant endTime = contest.getEndTime();
            List<Contest> endsAtSameTime = contestsByEndTime.get(endTime);
            if (endsAtSameTime != null) {
                endsAtSameTime.removeIf(c -> c.getId().equals(contestId));
                if (endsAtSameTime.isEmpty()) {
                    contestsByEndTime.remove(endTime);
                }
            }
        }
    }

    private void logUpcomingContests() {
        // Find the next few contests to start and end for logging purposes
        Instant now = Instant.now();
        List<Contest> upcomingStarts = contestsById.values().stream()
                .filter(c -> c.getStartTime().isAfter(now))
                .sorted(Comparator.comparing(Contest::getStartTime))
                .limit(5)
                .toList();

        if (!upcomingStarts.isEmpty()) {
            logger.info("Next contests to start:");
            for (Contest c : upcomingStarts) {
                ZonedDateTime startTime = ZonedDateTime.ofInstant(c.getStartTime(), ZoneOffset.UTC);
                logger.info(" - {} (ID: {}) starts at {}",
                        c.getName(), c.getId(), startTime.format(DateTimeFormatter.ISO_DATE_TIME));
            }
        }
    }

    private void scheduleContestEvents(Contest contest) {
        Instant now = Instant.now();
        // Schedule start event if it's in the future
        if (contest.getStartTime().isAfter(now)) {
            ScheduledFuture<?> startTask = taskScheduler.schedule(
                    () -> emitContestStartedEvent(contest),
                    Date.from(contest.getStartTime())
            );
            scheduledTasks.add(startTask);
            logger.debug("Scheduled start event for contest {}: {}", contest.getId(), contest.getName());
        }

        // Schedule end event if it's in the future
        if (contest.getEndTime().isAfter(now)) {
            ScheduledFuture<?> endTask = taskScheduler.schedule(
                    () -> emitContestEndedEvent(contest),
                    Date.from(contest.getEndTime())
            );
            scheduledTasks.add(endTask);
            logger.debug("Scheduled end event for contest {}: {}", contest.getId(), contest.getName());
        }
    }

    private void emitContestStartedEvent(Contest contest) {
        logger.info("CONTEST STARTED: {} (ID: {})", contest.getName(), contest.getId());

        // Update problems in contest to public
        if (problemClient.updateProblemStatus(contest.getId(), new ProblemUpdateRequest(true)).data() != true) {
            throw new ApiRequestException(ErrorMessageConstants.CONTEST_HAS_NOT_STARTED, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Publish Spring application event
        // eventPublisher.publishEvent(new ContestActionEvent(contest.getId(), contest.getStartTime(), contest.getEndTime()));

        // Publish to Kafka
        publishContestStartedToKafka(contest);

        // Add to published set to avoid duplicate events
        publishedStartEvents.add(contest.getId());
    }

    private void emitContestEndedEvent(Contest contest) {
        logger.info("CONTEST ENDED: {} (ID: {})", contest.getName(), contest.getId());

        // Publish Spring application event
        // eventPublisher.publishEvent(new ContestActionEvent(contest.getId(), contest.getStartTime(), contest.getEndTime()));

        // Publish to Kafka
        publishContestEndedToKafka(contest);

        // Schedule ranking completion 1 minute after contest end
        Instant rankingCompletionTime = contest.getEndTime().plus(1, ChronoUnit.MINUTES);
        ScheduledFuture<?> rankingTask = taskScheduler.schedule(
                () -> completeContestRanking(contest),
                Date.from(rankingCompletionTime)
        );
        scheduledTasks.add(rankingTask);
        logger.info("Scheduled ranking completion for contest {} at {}",
                contest.getId(),
                rankingCompletionTime
        );

        // Add to published set to avoid duplicate events
        publishedEndEvents.add(contest.getId());
    }

    /**
     * This method runs every minute to check if any contests need to start or end
     * This ensures events are published even if the scheduler missed an event
     * Now optimized with time-based maps
     */
//    @Scheduled(cron = "0 * * * * ?") // Run every minute at 0 seconds
//    public void checkContestStartsAndEnds() {
//        logger.info("Running minutely contest check...");
//
//        if (contestsById.isEmpty()) {
//            return; // Nothing to check
//        }
//
//        Instant now = Instant.now();
//        Instant oneMinuteAgo = now.minus(1, ChronoUnit.MINUTES);
//
//        // Get all minute timestamps between oneMinuteAgo and now (typically just a few values)
//        Set<Instant> relevantMinuteTimestamps = getMinuteTimestampsBetween(oneMinuteAgo, now);
//
//        // Check contests scheduled to start in the relevant time window
//        for (Instant timestamp : relevantMinuteTimestamps) {
//            List<Contest> contestsStartingAtTime = contestsByStartTime.get(timestamp);
//            if (contestsStartingAtTime != null) {
//                for (Contest contest : new ArrayList<>(contestsStartingAtTime)) {
//                    if (!publishedStartEvents.contains(contest.getId())) {
//                        logger.info("Detected contest start during minutely scan: {} (ID: {})",
//                                contest.getName(), contest.getId());
//                        emitContestStartedEvent(contest);
//                    }
//                }
//            }
//
//            // Check contests scheduled to end in the relevant time window
//            List<Contest> contestsEndingAtTime = contestsByEndTime.get(timestamp);
//            if (contestsEndingAtTime != null) {
//                for (Contest contest : new ArrayList<>(contestsEndingAtTime)) {
//                    if (!publishedEndEvents.contains(contest.getId())) {
//                        logger.info("Detected contest end during minutely scan: {} (ID: {})",
//                                contest.getName(), contest.getId());
//                        emitContestEndedEvent(contest);
//                    }
//                }
//            }
//        }
//
//        // Clean up old events from the published sets
//        cleanupOldPublishedEvents();
//    }

    /**
     * Helper method to get all minute timestamps between two instants
     * This is used to find all possible minute timestamps that need to be checked
     */
    private Set<Instant> getMinuteTimestampsBetween(Instant start, Instant end) {
        Set<Instant> timestamps = new HashSet<>();

        // Truncate start to minute precision
        Instant current = start.truncatedTo(ChronoUnit.MINUTES);

        // Add each minute timestamp between start and end
        while (!current.isAfter(end)) {
            timestamps.add(current);
            current = current.plus(1, ChronoUnit.MINUTES);
        }

        return timestamps;
    }

    private boolean isTimeBetween(Instant time, Instant start, Instant end) {
        return !time.isBefore(start) && !time.isAfter(end);
    }

    private void cleanupOldPublishedEvents() {
        // Keep the sets from growing too large by removing contest IDs for contests no longer in cache
        publishedStartEvents.removeIf(id -> !contestsById.containsKey(id));
        publishedEndEvents.removeIf(id -> !contestsById.containsKey(id));
    }

    private void publishContestStartedToKafka(Contest contest) {
        try {
            List<ContestRegistration> x = this.registrationService.getAll(contest.getId());
            // get problem set
            String problemset = this.problemClient.getAllProblemsByContestId(contest.getId()).data().stream().map(ProblemResponse::getId).toList().stream().map(Objects::toString).collect(Collectors.joining(","));

            kafkaTemplate.send("submission.result", contest.getId().toString(), new ContestActionEvent(contest.getId(), contest.getStartTime(), contest.getEndTime(), ContestantsConverter.toJsonString(x), ContestEvent.CONTEST_STARTED, contest.getType(), problemset));
            logger.info("Published contest start event to Kafka: {}", contest.getId());
        } catch (Exception e) {
            logger.error("Failed to publish contest start event to Kafka: {}", contest.getId(), e);
        }
    }

    private void publishContestEndedToKafka(Contest contest) {
        try {
            kafkaTemplate.send("submission.result", contest.getId().toString(), new ContestActionEvent(contest.getId(), contest.getStartTime(), contest.getEndTime(), null, ContestEvent.CONTEST_ENDED, ContestType.SYSTEM, null));
            logger.info("Published contest end event to Kafka: {}", contest.getId());
        } catch (Exception e) {
            logger.error("Failed to publish contest end event to Kafka: {}", contest.getId(), e);
        }
    }

    private void clearScheduledTasks() {
        // Cancel all previously scheduled tasks
        for (ScheduledFuture<?> task : scheduledTasks) {
            task.cancel(false);
        }
        scheduledTasks.clear();
        logger.debug("Cleared all previously scheduled contest event tasks");
    }

    // Manual refresh trigger for admin purposes
    public void triggerManualRefresh() {
        logger.info("Manual refresh triggered");
        refreshContestsCache();
    }

    // Event listeners to keep the cache in sync with any contest changes

    @EventListener
    public void handleContestCreatedEvent(ContestCreatedEvent event) {
        Contest contest = event.getContest();
        logger.info("Contest created event received: {} (ID: {})", contest.getName(), contest.getId());
        updateContestInCache(contest);
    }

    @EventListener
    public void handleContestUpdatedEvent(ContestUpdatedEvent event) {
        Contest contest = event.getContest();
        logger.info("Contest updated event received: {} (ID: {})", contest.getName(), contest.getId());
        updateContestInCache(contest);
    }

    @EventListener
    public void handleContestDeletedEvent(ContestDeletedEvent event) {
        Long contestId = event.getContestId();
        logger.info("Contest deleted event received: ID {}", contestId);
        removeContestFromCache(contestId);
    }

    @EventListener
    public void handleVirtualContestCreatedEvent(VirtualContestCreatedEvent event) {
        VirtualContest virtualContest = event.getVirtualContest();
        List<ContestRegistration> contestants = this.registrationService.getAll(virtualContest.getContest());
        String problemset = this.problemClient.getAllProblemsByContestId(virtualContest.getContest()).data().stream().map(ProblemResponse::getId).toList().stream().map(Objects::toString).collect(Collectors.joining(","));
        boolean hasJoin = false;
        for (var x : contestants) {
            if (x.getUser().equals(virtualContest.getUser())) {
                hasJoin = true;
                break;
            }
        }

        var currentUser = new ContestRegistration();
        currentUser.setUser(virtualContest.getUser());
        currentUser.setContest(virtualContest.getContest());
        currentUser.setRated(true);
        currentUser.setParticipated(true);
        List<ContestRegistration> participants = new ArrayList<>(contestants);
        if (!hasJoin) participants.add(currentUser);
        this.rankingClient.startVirtualContest(new VirtualContestRequest(
                virtualContest.getId(),
                virtualContest.getContest(),
                virtualContest.getUser(),
                virtualContest.getActualStartTime(),
                virtualContest.getActualEndTime(),
                virtualContest.getStartTime(),
                virtualContest.getEndTime(),
                problemset,
                ContestantsConverter.toJsonString(participants)));
    }

    private void updateContestInCache(Contest contest) {
        // Check if this contest is relevant for our current tracking period
        Instant now = Instant.now();
        LocalDate endDate = LocalDate.now(ZoneOffset.UTC).plusDays(properties.getMaxLookAheadDays());
        Instant periodEnd = endDate.atStartOfDay(ZoneOffset.UTC).toInstant();

        boolean startsInPeriod = isBetween(contest.getStartTime(), now, periodEnd);
        boolean endsInPeriod = isBetween(contest.getEndTime(), now, periodEnd);
        boolean spansPeriod = contest.getStartTime().isBefore(now) &&
                contest.getEndTime().isAfter(periodEnd);
        boolean isActive = contest.getStartTime().isBefore(now) &&
                contest.getEndTime().isAfter(now);

        if (startsInPeriod || endsInPeriod || spansPeriod || isActive) {
            // Remove this contest from all caches first (if it exists)
            removeContestFromAllCaches(contest.getId());

            // Add the contest to all caches
            addContestToCache(contest);

            // Remove any existing scheduled events for this contest
            removeTasksForContest(contest.getId());

            // Schedule new events
            scheduleContestEvents(contest);
            logger.info("Updated contest in cache: {} (ID: {})", contest.getName(), contest.getId());
        }
    }

    private void removeContestFromCache(Long contestId) {
        // Get the contest before removing it (for logging)
        Contest contest = contestsById.get(contestId);

        // Remove from all in-memory maps
        removeContestFromAllCaches(contestId);

        // Cancel any scheduled tasks for this contest
        removeTasksForContest(contestId);

        // Remove from published events sets
        publishedStartEvents.remove(contestId);
        publishedEndEvents.remove(contestId);

        if (contest != null) {
            logger.info("Removed contest from cache: {} (ID: {})",
                    contest.getName(), contestId);
        } else {
            logger.info("Removed contest from cache: ID {}", contestId);
        }
    }

    private void removeTasksForContest(Long contestId) {
        scheduledTasks.removeIf(task -> {
            if (task.toString().contains("contest-" + contestId)) {
                task.cancel(false);
                return true;
            }
            return false;
        });
    }

    private boolean isBetween(Instant time, Instant start, Instant end) {
        return !time.isBefore(start) && time.isBefore(end);
    }

    // Expose a method to get the current number of cached contests (for metrics/monitoring)
    public int getCachedContestCount() {
        return contestsById.size();
    }

    // Expose a method to get the current number of scheduled tasks (for metrics/monitoring)
    public int getScheduledTaskCount() {
        return scheduledTasks.size();
    }

    /**
     * Manually add or update a contest in the in-memory cache.
     * This is useful when a contest is created or updated via the API.
     *
     * @param contest The contest to add or update
     * @return true if the contest was added/updated, false if it was ignored (outside look-ahead period)
     */
    public boolean manuallyAddOrUpdateContest(Contest contest) {
        logger.info("Manually adding/updating contest in cache: {} (ID: {})",
                contest.getName(), contest.getId());

        // First check if this contest is within our look-ahead period
        Instant now = Instant.now();
        LocalDate endDate = LocalDate.now(ZoneOffset.UTC).plusDays(properties.getMaxLookAheadDays());
        Instant periodEnd = endDate.atStartOfDay(ZoneOffset.UTC).toInstant();

        boolean startsInPeriod = isBetween(contest.getStartTime(), now, periodEnd);
        boolean endsInPeriod = isBetween(contest.getEndTime(), now, periodEnd);
        boolean spansPeriod = contest.getStartTime().isBefore(now) &&
                contest.getEndTime().isAfter(periodEnd);
        boolean isActive = contest.getStartTime().isBefore(now) &&
                contest.getEndTime().isAfter(now);

        if (startsInPeriod || endsInPeriod || spansPeriod || isActive) {
            // Check if this is an update to an existing contest
            Contest previousContest = contestsById.get(contest.getId());

            // If contest exists and either start or end time changed, we need to update all caches
            if (previousContest != null &&
                    (!previousContest.getStartTime().equals(contest.getStartTime()) ||
                            !previousContest.getEndTime().equals(contest.getEndTime()))) {

                // Remove from all caches before adding with new timestamps
                removeContestFromAllCaches(contest.getId());

                // Cancel any scheduled tasks for this contest
                removeTasksForContest(contest.getId());

                logger.info("Replacing existing contest in cache with updated timestamps: {} (ID: {})",
                        previousContest.getName(), previousContest.getId());
            } else if (previousContest != null) {
                // Just update the ID-based map for simple property changes
                contestsById.put(contest.getId(), contest);

                // Update contests in time-based maps (by reference)
                updateContestInTimeMaps(previousContest, contest);

                logger.info("Updated existing contest in cache (same timestamps): {} (ID: {})",
                        previousContest.getName(), previousContest.getId());

                // No need to reschedule tasks if times didn't change
                return true;
            } else {
                // New contest, add to all caches
                addContestToCache(contest);
            }

            // Schedule new events
            scheduleContestEvents(contest);
            logger.info("Contest successfully added/updated in cache: {} (ID: {})",
                    contest.getName(), contest.getId());
            return true;
        } else {
            logger.info("Contest {} (ID: {}) is outside the look-ahead period, not adding to cache",
                    contest.getName(), contest.getId());
            return false;
        }
    }

    /**
     * Helper method to update a contest in the time-based maps without removing and re-adding
     * This is only for updates that don't change the start or end time
     */
    private void updateContestInTimeMaps(Contest oldContest, Contest newContest) {
        Instant startTime = oldContest.getStartTime();
        List<Contest> startsAtSameTime = contestsByStartTime.get(startTime);
        if (startsAtSameTime != null) {
            for (int i = 0; i < startsAtSameTime.size(); i++) {
                if (startsAtSameTime.get(i).getId().equals(oldContest.getId())) {
                    startsAtSameTime.set(i, newContest);
                    break;
                }
            }
        }

        Instant endTime = oldContest.getEndTime();
        List<Contest> endsAtSameTime = contestsByEndTime.get(endTime);
        if (endsAtSameTime != null) {
            for (int i = 0; i < endsAtSameTime.size(); i++) {
                if (endsAtSameTime.get(i).getId().equals(oldContest.getId())) {
                    endsAtSameTime.set(i, newContest);
                    break;
                }
            }
        }
    }

    /**
     * Manually remove a contest from the in-memory cache.
     * This is useful when a contest is deleted via the API.
     *
     * @param contestId The ID of the contest to remove
     * @return true if the contest was removed, false if it wasn't in the cache
     */
    public boolean manuallyRemoveContest(Long contestId) {
        logger.info("Manually removing contest from cache: ID {}", contestId);

        Contest existingContest = contestsById.get(contestId);
        if (existingContest != null) {
            removeContestFromCache(contestId);
            return true;
        } else {
            logger.info("Contest ID {} was not in the cache, nothing to remove", contestId);
            return false;
        }
    }

    /**
     * Get a contest from the in-memory cache by ID.
     * This is useful for checking if a contest is in the cache.
     *
     * @param contestId The ID of the contest to get
     * @return The contest, or null if not found
     */
    public Contest getContestFromCache(Long contestId) {
        return contestsById.get(contestId);
    }

    /**
     * Get all contests currently in the in-memory cache.
     *
     * @return A list of all contests in the cache
     */
    public List<Contest> getAllCachedContests() {
        return new ArrayList<>(contestsById.values());
    }

    /**
     * Get the number of contests scheduled to start in the next few hours
     * This can be used for monitoring purposes
     */
    public Map<String, Integer> getUpcomingContestMetrics() {
        Instant now = Instant.now();
        Instant oneHour = now.plus(1, ChronoUnit.HOURS);
        Instant threeHours = now.plus(3, ChronoUnit.HOURS);
        Instant twentyFourHours = now.plus(24, ChronoUnit.HOURS);

        Map<String, Integer> metrics = new HashMap<>();

        metrics.put("startingNextHour", countContestsStartingBetween(now, oneHour));
        metrics.put("startingNext3Hours", countContestsStartingBetween(now, threeHours));
        metrics.put("startingNext24Hours", countContestsStartingBetween(now, twentyFourHours));

        metrics.put("endingNextHour", countContestsEndingBetween(now, oneHour));
        metrics.put("endingNext3Hours", countContestsEndingBetween(now, threeHours));
        metrics.put("endingNext24Hours", countContestsEndingBetween(now, twentyFourHours));

        metrics.put("totalCachedContests", contestsById.size());
        metrics.put("totalScheduledTasks", scheduledTasks.size());

        return metrics;
    }

    private int countContestsStartingBetween(Instant start, Instant end) {
        return (int) contestsById.values().stream()
                .filter(c -> c.getStartTime().isAfter(start) && c.getStartTime().isBefore(end))
                .count();
    }

    private int countContestsEndingBetween(Instant start, Instant end) {
        return (int) contestsById.values().stream()
                .filter(c -> c.getEndTime().isAfter(start) && c.getEndTime().isBefore(end))
                .count();
    }

    // Add new method for ranking completion
    private void completeContestRanking(Contest contest) {
        try {
            logger.info("Starting ranking completion for contest: {} (ID: {})",
                    contest.getName(),
                    contest.getId()
            );

            BaseResponse<Boolean> response = rankingClient.completeContest(
                    contest.getId()
            );

            if (!response.data()) {
                logger.error("Failed to complete ranking for contest {}: Ranking service returned false",
                        contest.getId()
                );
            } else {
                logger.info("Successfully completed ranking for contest: {} (ID: {})",
                        contest.getName(),
                        contest.getId()
                );
            }
        } catch (Exception e) {
            logger.error("Failed to complete ranking for contest {}: {}",
                    contest.getId(),
                    e.getMessage(),
                    e
            );
            // Optionally implement retry logic here
        }
    }
}