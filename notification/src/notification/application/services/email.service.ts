import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: EmailTemplate,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: template.toString(),
        context,
      });
      this.logger.log(`Email sent to ${to} with template ${template}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
