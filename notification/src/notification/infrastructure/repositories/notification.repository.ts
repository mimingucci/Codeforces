import { Injectable } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../schemas/notification.schema';
import { NotificationType } from '../../domain/value-objects/notification-type.enum';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async save(notification: Notification): Promise<void> {
    const notificationDoc = new this.notificationModel({
      _id: notification.getId(),
      userId: notification.getUserId(),
      recipient: notification.getRecipient(),
      type: notification.getType(),
      template: notification.getTemplate(),
      subject: notification.getSubject(),
      data: notification.getData(),
      status: notification.getStatus(),
      createdAt: notification.getCreatedAt(),
      sentAt: notification.getSentAt(),
      failureReason: notification.getFailureReason(),
      retryCount: notification.getRetryCount(),
    });

    await notificationDoc.save();
  }

  async update(notification: Notification): Promise<void> {
    await this.notificationModel.updateOne(
      { _id: notification.getId() },
      {
        status: notification.getStatus(),
        sentAt: notification.getSentAt(),
        failureReason: notification.getFailureReason(),
        retryCount: notification.getRetryCount(),
      },
    );
  }

  async findById(id: string): Promise<Notification | null> {
    const notificationDoc = await this.notificationModel.findById(id).exec();
    if (!notificationDoc) {
      return null;
    }

    return this.mapToEntity(notificationDoc);
  }

  async findPendingNotifications(): Promise<Notification[]> {
    const notificationDocs = await this.notificationModel
      .find({ status: 'pending' })
      .exec();

    return notificationDocs.map(doc => this.mapToEntity(doc));
  }

  async findFailedNotifications(maxRetries: number): Promise<Notification[]> {
    const notificationDocs = await this.notificationModel
      .find({
        status: 'failed',
        retryCount: { $lt: maxRetries },
      })
      .exec();

    return notificationDocs.map(doc => this.mapToEntity(doc));
  }

  private mapToEntity(doc: NotificationDocument): Notification {
    const notification = new Notification(
      doc._id,
      doc.userId,
      doc.recipient,
      doc.type as NotificationType,
      doc.template as EmailTemplate,
      doc.subject,
      doc.data,
    );

    // Set the state according to the document
    if (doc.status === 'sent') {
      notification.markAsSent();
    } else if (doc.status === 'failed') {
      notification.markAsFailed(doc.failureReason);
    }

    // Set retry count
    for (let i = 0; i < doc.retryCount; i++) {
      notification.incrementRetryCount();
    }

    return notification;
  }
}
