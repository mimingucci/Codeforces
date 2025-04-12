import { AggregateRoot } from '@nestjs/cqrs';
import { NotificationType } from '../value-objects/notification-type.enum';
import { NotificationStatus } from '../value-objects/notification-status.enum';
import { EmailTemplate } from '../value-objects/email-template.enum';

export class Notification extends AggregateRoot {
  private readonly id: string;
  private readonly userId: string;
  private readonly recipient: string;
  private readonly type: NotificationType;
  private readonly template: EmailTemplate;
  private readonly subject: string;
  private readonly data: Record<string, any>;
  private readonly createdAt: Date;
  private sentAt: Date | null;
  private status: NotificationStatus;
  private failureReason: string | null;
  private retryCount: number;

  constructor(
    id: string,
    userId: string,
    recipient: string,
    type: NotificationType,
    template: EmailTemplate,
    subject: string,
    data: Record<string, any>,
  ) {
    super();
    this.id = id;
    this.userId = userId;
    this.recipient = recipient;
    this.type = type;
    this.template = template;
    this.subject = subject;
    this.data = data;
    this.createdAt = new Date();
    this.sentAt = null;
    this.status = NotificationStatus.PENDING;
    this.failureReason = null;
    this.retryCount = 0;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getRecipient(): string {
    return this.recipient;
  }

  getType(): NotificationType {
    return this.type;
  }

  getTemplate(): EmailTemplate {
    return this.template;
  }

  getSubject(): string {
    return this.subject;
  }

  getData(): Record<string, any> {
    return this.data;
  }

  getStatus(): NotificationStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getSentAt(): Date | null {
    return this.sentAt;
  }

  getFailureReason(): string | null {
    return this.failureReason;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  // Business logic methods
  markAsSent(): void {
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
  }

  markAsFailed(reason: string): void {
    this.status = NotificationStatus.FAILED;
    this.failureReason = reason;
  }

  incrementRetryCount(): void {
    this.retryCount += 1;
  }

  canRetry(maxRetries: number): boolean {
    return this.status === NotificationStatus.FAILED && this.retryCount < maxRetries;
  }
}
