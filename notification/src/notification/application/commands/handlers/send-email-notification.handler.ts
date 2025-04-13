import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../send-email-notification.command';
import { NotificationDomainService } from '../../../domain/services/notification-domain.service';
import { EmailService } from '../../services/email.service';
import { Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(SendEmailNotificationCommand)
export class SendEmailNotificationHandler implements ICommandHandler<SendEmailNotificationCommand> {
  private readonly logger = new Logger(SendEmailNotificationHandler.name);

  constructor(
    private readonly notificationDomainService: NotificationDomainService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendEmailNotificationCommand): Promise<void> {
    const { userId, recipient, template, subject, data } = command;

    // Validate email
    if (!this.notificationDomainService.isValidEmail(recipient)) {
      throw new BadRequestException('Invalid email address');
    }

    // Create notification entity
    const notification = this.notificationDomainService.createEmailNotification(
      userId,
      recipient,
      template,
      subject,
      data,
    );

    try {

      // Send email
      await this.emailService.sendEmail(
        notification.getRecipient(),
        notification.getSubject(),
        notification.getTemplate(),
        notification.getData(),
      );

      // Update notification status
      notification.markAsSent();

      this.logger.log(
        `Email notification sent to ${recipient} with template ${template}`,
      );
    } catch (error) {
      // Handle failure
      notification.markAsFailed(error.message);
      
      this.logger.error(
        `Failed to send email notification to ${recipient}: ${error.message}`,
        error.stack,
      );
      
      throw error;
    }
  }
}
