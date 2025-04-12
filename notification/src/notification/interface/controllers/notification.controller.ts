import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendEmailNotificationCommand } from '../../application/commands/send-email-notification.command';
import { SendEmailDto } from '../dtos/send-email.dto';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Post('email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<{ success: boolean }> {
    this.logger.log(`Received email request for ${sendEmailDto.recipient}`);
    
    await this.commandBus.execute(
      new SendEmailNotificationCommand(
        sendEmailDto.userId,
        sendEmailDto.recipient,
        sendEmailDto.template,
        sendEmailDto.subject,
        sendEmailDto.data,
      ),
    );
    
    return { success: true };
  }
}
