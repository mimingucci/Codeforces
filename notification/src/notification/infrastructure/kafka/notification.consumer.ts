import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../../application/commands/send-email-notification.command';
import { Logger } from '@nestjs/common';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';
import { KafkaTopic } from 'src/notification/domain/value-objects/kafka-topics.enum';
import { UserNotificationMessage, ContestNotificationMessage, SystemNotificationMessage } from '../../domain/types/kafka-messages.type';


@Injectable()
export class NotificationConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit() {
    // Subscribe to topics
    await this.consumerService.subscribe(
      Object.values(KafkaTopic),
      'notification-consumer',
      this.handleMessage.bind(this),
    );
  }

  async handleMessage(message: any): Promise<void> {
    const { topic, value } = message;
    const payload = JSON.parse(value.toString());
    
    this.logger.log(`Received email notification request: ${JSON.stringify(payload)}`);

    try {
      switch (topic) {
        case KafkaTopic.USER_NOTIFICATION:
          await this.handleEmailNotification(payload as UserNotificationMessage);
          break;

        case KafkaTopic.CONTEST_NOTIFICATION:
          await this.handleContestNotification(payload as ContestNotificationMessage);
          break;

        case KafkaTopic.SYSTEM_NOTIFICATION:
          await this.handleSystemNotification(payload as SystemNotificationMessage);
          break;

        default:
          this.logger.warn(`Unknown topic: ${topic}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing message from topic ${topic}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async handleEmailNotification(payload: UserNotificationMessage): Promise<void> {
    const { userId, recipient, templateName, subject, data } = payload;
    
    const template = EmailTemplate[templateName.toUpperCase()];
    if (!template) {
      this.logger.error(`Unknown email template: ${templateName}`);
      return;
    }

    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        userId,
        recipient,
        template,
        subject,
        data,
      ),
    );
  }

  private async handleContestNotification(payload: ContestNotificationMessage): Promise<void> {
    const { contestId, contestName, startTime, endTime, participants } = payload;
    
    // Send contest notification emails to all participants
    for (const participant of participants) {
      await this.commandBus.execute(
        new SendEmailNotificationCommand(
          participant,
          participant, // assuming participant is email
          EmailTemplate.CONTEST_INVITATION,
          `Contest Invitation: ${contestName}`,
          {
            contestId,
            contestName,
            startTime,
            endTime,
          }
        ),
      );
    }
  }

  private async handleSystemNotification(payload: SystemNotificationMessage): Promise<void> {
    const { type, message, targets, priority } = payload;
    
    // Handle system notifications (could be emails, websocket messages, etc.)
    this.logger.log(`Processing system notification: ${type} with priority ${priority}`);
    
    // Implementation depends on your system notification requirements
  }
}
