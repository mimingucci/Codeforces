import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import Eureka from 'eureka-js-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  const port = configService.get<number>('PORT', 9093);
  const serviceName = configService.get<string>('EUREKA_SERVICE_NAME', 'notification-service');
  const eurekaHost = configService.get<string>('EUREKA_HOST', 'localhost');
  const eurekaPort = configService.get<number>('EUREKA_PORT', 8761);
  const hostName = configService.get<string>('HOST_NAME', 'localhost');
  const ipAddr = configService.get<string>('IP_ADDR', 'localhost');

  const client = new Eureka({
    // application instance information
    instance: {
      app: 'notification',
      hostName: hostName,
      ipAddr: ipAddr,
      port: port,
    },
    eureka: {
      // eureka server host / port
      host: eurekaHost,
      port: eurekaPort,
    },
  });
  
  await app.listen(port);
  await client.start();
  logger.log(`Notification service is running on port ${port}`);
  logger.log(`Registered with Eureka at ${eurekaHost}:${eurekaPort} as ${serviceName}`);
}
bootstrap();
