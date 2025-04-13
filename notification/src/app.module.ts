import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationModule } from './notification/notification.module';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // Kafka client
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'notification-service',
              brokers: configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
            },
            consumer: {
              groupId: 'notification-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // Mailer module
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get('MAIL_PORT', 587),
          secure: configService.get('MAIL_SECURE', false),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get('MAIL_FROM_NAME', 'Codeforces')}" <${configService.get('MAIL_FROM_EMAIL', 'noreply@codeforces.com')}>`,
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    NotificationModule,

    HealthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
