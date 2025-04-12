import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../../domain/value-objects/notification-type.enum';
import { NotificationStatus } from '../../domain/value-objects/notification-status.enum';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true, enum: NotificationType })
  type: string;

  @Prop({ required: true, enum: EmailTemplate })
  template: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;

  @Prop({ required: true, enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  sentAt: Date;

  @Prop()
  failureReason: string;

  @Prop({ default: 0 })
  retryCount: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
