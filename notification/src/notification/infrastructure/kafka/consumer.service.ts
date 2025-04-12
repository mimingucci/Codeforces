import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, ConsumerSubscribeTopics, Kafka } from 'kafkajs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  private readonly logger = new Logger(ConsumerService.name);

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'notification-service',
      brokers: this.configService
        .get<string>('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
    });
  }

  async subscribe(
    topics: string[],
    groupId: string,
    onMessage: (message: any) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();

    const topicsToSubscribe: ConsumerSubscribeTopics = {
      topics,
      fromBeginning: false,
    };

    await consumer.subscribe(topicsToSubscribe);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.debug(
          `Processing message from topic ${topic} [partition: ${partition}]`,
        );
        await onMessage(message);
      },
    });

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
