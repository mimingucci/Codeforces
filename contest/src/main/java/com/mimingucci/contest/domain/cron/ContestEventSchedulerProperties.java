package com.mimingucci.contest.domain.cron;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@ConfigurationProperties(prefix = "contest.scheduler")
@Component
public class ContestEventSchedulerProperties {
    // Default fetch times in cron expressions (Default: midnight "0 0 0 * * ?")
    private List<String> fetchCronExpressions = Collections.singletonList("0 0 0 * * ?");

    // Maximum number of days to look ahead for contests
    private int maxLookAheadDays = 2;

    // Whether to fetch on startup
    private boolean fetchOnStartup = true;

    // Getters and setters
    public List<String> getFetchCronExpressions() {
        return fetchCronExpressions;
    }

    public void setFetchCronExpressions(List<String> fetchCronExpressions) {
        this.fetchCronExpressions = fetchCronExpressions;
    }

    public int getMaxLookAheadDays() {
        return maxLookAheadDays;
    }

    public void setMaxLookAheadDays(int maxLookAheadDays) {
        this.maxLookAheadDays = maxLookAheadDays;
    }

    public boolean isFetchOnStartup() {
        return fetchOnStartup;
    }

    public void setFetchOnStartup(boolean fetchOnStartup) {
        this.fetchOnStartup = fetchOnStartup;
    }
}
