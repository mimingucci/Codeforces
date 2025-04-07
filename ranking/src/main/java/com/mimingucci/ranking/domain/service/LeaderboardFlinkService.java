package com.mimingucci.ranking.domain.service;

import com.mimingucci.ranking.common.constant.KafkaTopicConstants;
import com.mimingucci.ranking.common.deserializer.ContestMetadataDeserializationSchema;
import com.mimingucci.ranking.common.deserializer.SubmissionResultEventDeserializationSchema;
import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.model.ContestMetadata;
import com.mimingucci.ranking.domain.model.LeaderboardUpdateSerializable;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.state.MapStateDescriptor;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.BroadcastStream;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaderboardFlinkService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;

    private final SubmissionResultRepository submissionResultRepository;

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

        KafkaSource<ContestMetadata> contestMetadataSource = KafkaSource.<ContestMetadata>builder()
                .setBootstrapServers("localhost:9092")
                .setGroupId("leaderboard-consumer")
                .setTopics(KafkaTopicConstants.CONTEST_ACTION) // topic for start/over events
                .setValueOnlyDeserializer(new ContestMetadataDeserializationSchema())
                .setStartingOffsets(OffsetsInitializer.earliest())
                .build();

        DataStream<ContestMetadata> contestMetadataStream = env
                .fromSource(contestMetadataSource, WatermarkStrategy.noWatermarks(), "Contest Metadata Source");

        // Define broadcast state descriptor
        MapStateDescriptor<Long, ContestMetadata> metadataDescriptor =
                new MapStateDescriptor<>("contestMetadata", Long.class, ContestMetadata.class);

        // Broadcast it
        BroadcastStream<ContestMetadata> broadcastMetadata = contestMetadataStream.broadcast(metadataDescriptor);


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
                .connect(broadcastMetadata)
                .process(new LeaderboardProcessFunction(metadataDescriptor, leaderboardEntryRepository, submissionResultRepository))
                .name("Leaderboard Processor");

        // Add Redis sink
        leaderboardStream
                .addSink(new RedisLeaderboardSink(
                "localhost",
                6379,
                "leaderboard"
        )).name("Redis Sink");

        env.execute("Flink Leaderboard Job");
    }
}

