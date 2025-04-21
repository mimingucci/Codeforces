package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.common.deserializer.SubmissionResultEventDeserializationSchema;
import com.mimingucci.ranking.common.deserializer.VirtualSubmissionResultEventDeserializationSchema;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.event.VirtualSubmissionResultEvent;
import com.mimingucci.ranking.domain.model.LeaderboardUpdateSerializable;
import com.mimingucci.ranking.domain.model.VirtualLeaderboardUpdateSerializable;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaderboardFlinkService {

    @PostConstruct
    public void init() throws Exception {
        new Thread(() -> {
            try {
                startJob();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    public void startJob() throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // Regular contest processing - now with a single source
        KafkaSource<SubmissionResultEvent> kafkaSource = KafkaSource.<SubmissionResultEvent>builder()
                .setBootstrapServers("localhost:9092")
                .setGroupId("leaderboard-consumer")
                .setTopics(KafkaTopicConstants.SUBMISSION_RESULT)
                .setValueOnlyDeserializer(new SubmissionResultEventDeserializationSchema())
                .setStartingOffsets(OffsetsInitializer.latest())
                .build();

        DataStream<LeaderboardUpdateSerializable> leaderboardStream = env
                .fromSource(kafkaSource, WatermarkStrategy.noWatermarks(), "Kafka Source")
                .keyBy(SubmissionResultEvent::getContest)
                .process(new LeaderboardProcessFunction())
                .name("Leaderboard Processor");

        // Add Redis sink
        leaderboardStream
                .addSink(new RedisLeaderboardSink(
                "localhost",
                6379,
                "leaderboard:"
        )).name("Redis Sink");

        // Virtual contest processing
        KafkaSource<VirtualSubmissionResultEvent> virtualKafkaSource = KafkaSource.<VirtualSubmissionResultEvent>builder()
                .setBootstrapServers("localhost:9092")
                .setGroupId("virtual-leaderboard-consumer")
                .setTopics(KafkaTopicConstants.VIRTUAL_SUBMISSION_RESULT)
                .setValueOnlyDeserializer(new VirtualSubmissionResultEventDeserializationSchema())
                .setStartingOffsets(OffsetsInitializer.latest())
                .build();

        DataStream<VirtualLeaderboardUpdateSerializable> virtualLeaderboardStream = env
                .fromSource(virtualKafkaSource, WatermarkStrategy.noWatermarks(), "Virtual Kafka Source")
                .keyBy(VirtualSubmissionResultEvent::getContest)
                .process(new VirtualLeaderboardProcessFunction())
                .name("Virtual Leaderboard Processor");

        // Add Redis sinks for virtual contests
        virtualLeaderboardStream
                .addSink(new RedisVirtualLeaderboardSink(
                        "localhost",
                        6379,
                        "virtual-leaderboard:"
                )).name("Virtual Redis Sink");

        env.execute("Flink Leaderboard Job");
    }
}

