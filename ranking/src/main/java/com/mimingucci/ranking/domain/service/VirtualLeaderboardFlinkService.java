package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.common.deserializer.VirtualSubmissionResultEventDeserializationSchema;
import com.mimingucci.ranking.domain.event.VirtualSubmissionResultEvent;
import com.mimingucci.ranking.domain.model.VirtualLeaderboardUpdateSerializable;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.common.ExecutionConfig;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class VirtualLeaderboardFlinkService {
    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String kafkaBootstrapServers;

    @Value("${redis.host:localhost}")
    private String redisHost;

    @Value("${redis.port:6379}")
    private int redisPort;

    @PostConstruct
    public void init() {
        // Start Flink job in a different thread to not block application startup
        Thread flinkJobThread = new Thread(new VirtualLeaderboardFlinkService.FlinkJobRunner());
        flinkJobThread.setDaemon(false);
        flinkJobThread.start();
    }

    // Create a separate class to handle the Flink job startup logic
    private class FlinkJobRunner implements Runnable {
        @Override
        public void run() {
            boolean started = false;
            int attempts = 0;

            while (!started && attempts < 5) {
                try {
                    attempts++;
                    log.info("Starting Flink job, attempt {}", attempts);
                    log.info("Using Kafka at: {}", kafkaBootstrapServers);
                    log.info("Using Redis at: {}:{}", redisHost, redisPort);

                    startJob();
                    started = true;
                    log.info("Flink job started successfully");
                } catch (Exception e) {
                    log.error("Failed to start Flink job: {}", e.getMessage(), e);

                    try {
                        Thread.sleep(10000); // Wait 10 seconds before retrying
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }

            if (!started) {
                log.error("Failed to start Flink job after multiple attempts");
            }
        }
    }

    public void startJob() throws Exception {
        log.info("Configuring Flink environment");
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // Completely disable checkpointing
        env.getCheckpointConfig().disableCheckpointing();

        // Explicitly disable closure cleaning (important for our case)
        env.getConfig().setClosureCleanerLevel(ExecutionConfig.ClosureCleanerLevel.NONE);

        // Disable closure cleaning - not recommended for production
        env.disableOperatorChaining();

        // Start with just a simple job to test if Flink is working
        log.info("Creating Kafka source with bootstrap servers: {}", kafkaBootstrapServers);

        // Virtual contest processing
        KafkaSource<VirtualSubmissionResultEvent> virtualKafkaSource = KafkaSource.<VirtualSubmissionResultEvent>builder()
                .setBootstrapServers(kafkaBootstrapServers)
                .setGroupId("virtual-leaderboard-consumer")
                .setTopics(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT)
                .setValueOnlyDeserializer(new VirtualSubmissionResultEventDeserializationSchema())
                .setStartingOffsets(OffsetsInitializer.latest())
                .build();

        DataStream<VirtualLeaderboardUpdateSerializable> virtualLeaderboardStream = env
                .fromSource(virtualKafkaSource, WatermarkStrategy.noWatermarks(), "Virtual Kafka Source")
                .keyBy(VirtualSubmissionResultEvent::getVirtualContest)
                .process(new VirtualLeaderboardProcessFunction())
                .name("Virtual Leaderboard Processor");

        // Add Redis sinks for virtual contests
        virtualLeaderboardStream
                .addSink(new RedisVirtualLeaderboardSink(
                        redisHost,
                        redisPort,
                        "virtual-leaderboard:"
                )).name("Virtual Redis Sink");

        env.execute("Flink Leaderboard Job");
    }
}
