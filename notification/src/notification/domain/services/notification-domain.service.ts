import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { NotificationType } from '../value-objects/notification-type.enum';
import { EmailTemplate } from '../value-objects/email-template.enum';
import { v4 as uuid } from 'uuid';

@Injectable()
export class NotificationDomainService {
  createEmailNotification(
    userId: string,
    recipient: string,
    template: EmailTemplate,
    subject: string,
    data: Record<string, any>,
  ): Notification {
    return new Notification(
      uuid(),
      userId,
      recipient,
      NotificationType.EMAIL,
      template,
      subject,
      data,
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
