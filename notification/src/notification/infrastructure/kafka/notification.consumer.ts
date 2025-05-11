import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../../application/commands/send-email-notification.command';
import { Logger } from '@nestjs/common';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';
import {
  KafkaTopic,
  KafkaTopicType,
} from 'src/notification/domain/value-objects/kafka-topics.enum';
import {
  VerificationNotificationMessage,
  WelcomeNotificationMessage,
  ForgotPasswordNotificationMessage,
  PasswordChangedNotificationMessage,
} from '../../domain/types/kafka-messages.type';
import { KafkaMessage } from 'kafkajs';

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

  async handleMessage(message: KafkaMessage): Promise<void> {
    const { value } = message;
    const payload = value && JSON.parse(value.toString());
    if (!payload) return;

    this.logger.log(
      `Received email notification request: ${payload?.forgotPasswordToken}`,
    );
    const { type, ...data } = payload;
    try {
      switch (type) {
        case KafkaTopicType.REGISTER:
          await this.handleEmailVerification(
            data as VerificationNotificationMessage,
          );
          break;
        case KafkaTopicType.WELCOME:
          await this.handleEmailWelcome(data as WelcomeNotificationMessage);
          break;

        case KafkaTopicType.FORGOT_PASSWORD:
          await this.handleNotificationForgotPassword(
            payload as ForgotPasswordNotificationMessage,
          );
          break;

        case KafkaTopicType.PASSWORD_CHANGED:
          await this.handleNotificationPasswordChanged(
            payload as PasswordChangedNotificationMessage,
          );
          break;

        default:
          this.logger.warn(`Unknown type: ${type}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing message from topic ${type}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async handleEmailVerification(
    payload: VerificationNotificationMessage,
  ): Promise<void> {
    const template = EmailTemplate.VERIFICATION;

    if (!template) {
      this.logger.error(`Unknown email template: ${template}`);
      return;
    }

    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        payload.email,
        template,
        'Verify Registration',
        {
          email: payload.email,
          year: new Date().getFullYear(),
          verificationLink: `http://localhost:3000/verify?token=${payload.verificationCode}`,
        } as Record<string, any>,
      ),
    );
  }

  private async handleEmailWelcome(
    payload: WelcomeNotificationMessage,
  ): Promise<void> {
    const template = EmailTemplate.WELCOME;

    if (!template) {
      this.logger.error(`Unknown email template: ${template}`);
      return;
    }

    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        payload.email,
        template,
        'Welcome Codeforces!',
        {
          ...payload,
          year: new Date().getFullYear(),
        } as Record<string, any>,
      ),
    );
  }

  private async handleNotificationForgotPassword(
    payload: ForgotPasswordNotificationMessage,
  ): Promise<void> {
    const template = EmailTemplate.PASSWORD_RESET;

    if (!template) {
      this.logger.error(`Unknown email template: ${template}`);
      return;
    }

    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        payload.email,
        template,
        'Reset Password',
        {
          ...payload,
          year: new Date().getFullYear(),
          resetLink: payload.forgotPasswordToken,
        } as Record<string, any>,
      ),
    );
  }

  private async handleNotificationPasswordChanged(
    payload: PasswordChangedNotificationMessage,
  ): Promise<void> {
    const template = EmailTemplate.PASSWORD_CHANGED;

    if (!template) {
      this.logger.error(`Unknown email template: ${template}`);
      return;
    }

    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        payload.email,
        template,
        'Password Was Changed Succesfully',
        {
          ...payload,
          year: new Date().getFullYear(),
          timestamp: this.formatDateUTC(new Date(payload.createdAt * 1000)), // Multiply by 1000 to convert seconds to milliseconds
        } as Record<string, any>,
      ),
    );
  }

  private formatDateUTC(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );
    return `${formattedDate} [UTC+0]`;
  }
}
