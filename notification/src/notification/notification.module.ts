import { Module } from '@nestjs/common';
import { EmailService } from './application/services/email.service';
import { NotificationConsumer } from './infrastructure/kafka/notification.consumer';

@Module({
    providers: [
        EmailService,
        NotificationConsumer
        // Add other services and handlers here
    ],
    controllers: [], 
    exports: [
        EmailService,
        NotificationConsumer
        // Export services and handlers that need to be used in other modules
    ],
})
export class NotificationModule {}
