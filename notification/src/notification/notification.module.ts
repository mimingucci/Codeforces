import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailService } from './application/services/email.service';
import { NotificationConsumer } from './infrastructure/kafka/notification.consumer';
import { ConsumerService } from './infrastructure/kafka/consumer.service';
import { SendEmailNotificationHandler } from './application/commands/handlers/send-email-notification.handler';

@Module({
    imports: [
        CqrsModule,
    ],
    providers: [
        EmailService,
        ConsumerService,
        NotificationConsumer,
        SendEmailNotificationHandler
        // Add other services and handlers here
    ],
    controllers: [], 
    exports: [
        EmailService,
        NotificationConsumer
    ],
})
export class NotificationModule {}
