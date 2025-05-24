import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import Eureka from 'eureka-js-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = configService.get<number>('PORT', 8095);
  const serviceName = configService.get<string>(
    'EUREKA_SERVICE_NAME',
    'notification',
  );
  const eurekaHost = configService.get<string>('EUREKA_HOST', 'localhost');
  const eurekaPort = configService.get<number>('EUREKA_PORT', 8761);
  const hostName = configService.get<string>('HOST_NAME', 'localhost');
  const ipAddr = configService.get<string>('IP_ADDR', 'localhost');

  const client = new Eureka({
    instance: {
      app: serviceName,
      hostName: hostName,
      ipAddr: ipAddr,
      port: {
        $: port,
        '@enabled': true,
      },
      vipAddress: serviceName,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      statusPageUrl: `http://${hostName}:${port}/info`,
      healthCheckUrl: `http://${hostName}:${port}/health`,
      homePageUrl: `http://${hostName}:${port}`,
      instanceId: `${hostName}:${serviceName}:${port}`,
    },
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: '/eureka/apps/',
      maxRetries: 10,
      requestRetryDelay: 2000,
      preferIpAddress: true,
    },
  });

  await app.listen(port);

  await client.start();

  process.on('SIGINT', async () => {
    logger.log('Received SIGINT. Deregistering from Eureka...');
    await client.stop();
    process.exit();
  });

  process.on('SIGTERM', async () => {
    logger.log('Received SIGTERM. Deregistering from Eureka...');
    await client.stop();
    process.exit();
  });

  client.on('started', () => {
    logger.log('Eureka client started');
  });

  client.on('error', (error) => {
    logger.error('Eureka client error:', error);
  });

  client.on('deregistered', () => {
    logger.log('Eureka client deregistered');
  });

  logger.log(`Notification service is running on port ${port}`);

  logger.log(
    `Registered with Eureka at ${eurekaHost}:${eurekaPort} as ${serviceName}`,
  );
}
bootstrap();
