import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../../application/commands/send-email-notification.command';
import { Logger } from '@nestjs/common';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

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
      ['notification.email'],
      'notification-consumer',
      this.handleEmailNotification.bind(this),
    );
  }

  async handleEmailNotification(message: any): Promise<void> {
    try {
      const { value } = message;
      const payload = JSON.parse(value.toString());
      
      this.logger.log(`Received email notification request: ${JSON.stringify(payload)}`);

      const { userId, recipient, templateName, subject, data } = payload;
      
      // Map template name to enum
      const template = EmailTemplate[templateName.toUpperCase()];
      if (!template) {
        this.logger.error(`Unknown email template: ${templateName}`);
        return;
      }

      // Send command to handler
      await this.commandBus.execute(
        new SendEmailNotificationCommand(
          userId,
          recipient,
          template,
          subject,
          data,
        ),
      );
    } catch (error) {
      this.logger.error(
        `Error processing email notification: ${error.message}`,
        error.stack,
      );
    }
  }
}
