import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString()
    };
  }

  @Get('info')
  info() {
    return {
      app: process.env.EUREKA_SERVICE_NAME || 'notification-service',
      version: process.env.npm_package_version || '1.0.0'
    };
  }
}
