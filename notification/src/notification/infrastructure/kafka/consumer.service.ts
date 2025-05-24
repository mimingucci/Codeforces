import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, ConsumerSubscribeTopics, Kafka, KafkaMessage } from 'kafkajs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  private readonly logger = new Logger(ConsumerService.name);
  private readonly maxRetries = 3;

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
    onMessage: (message: KafkaMessage) => Promise<void>,
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
        
        let retries = 0;
        while (retries < this.maxRetries) {
          try {
            await onMessage(message);
            break; // Message processed successfully, exit retry loop
          } catch (error) {
            retries++;
            this.logger.warn(
              `Error processing message from topic ${topic} [partition: ${partition}], attempt ${retries}/${this.maxRetries}: ${error.message}`,
            );
            
            if (retries >= this.maxRetries) {
              this.logger.error(
                `Failed to process message after ${this.maxRetries} attempts. Moving to dead letter queue or logging for manual intervention.`,
                error.stack,
              );
              // Here you could implement dead letter queue logic
              // Example: await this.sendToDeadLetterQueue(topic, message);
            } else {
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            }
          }
        }
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
