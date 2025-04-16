import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../send-email-notification.command';
import { EmailService } from '../../services/email.service';
import { Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(SendEmailNotificationCommand)
export class SendEmailNotificationHandler implements ICommandHandler<SendEmailNotificationCommand> {
  private readonly logger = new Logger(SendEmailNotificationHandler.name);

  constructor(
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendEmailNotificationCommand): Promise<void> {
    const { recipient, template, subject, data } = command;

    // Validate email
    if (!this.isValidEmail(recipient)) {
      throw new BadRequestException('Invalid email address');
    }

    try {

      // Send email
      await this.emailService.sendEmail(
        recipient,
        subject,
        template,
        data,
      );

      this.logger.log(
        `Email notification sent to ${recipient} with template ${template}`,
      );
    } catch (error) {
      // Handle failure
      
      this.logger.error(
        `Failed to send email notification to ${recipient}: ${error.message}`,
        error.stack,
      );
      
      throw error;
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
