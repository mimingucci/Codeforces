import { IsNotEmpty, IsEmail, IsString, IsEnum, IsObject } from 'class-validator';
import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @IsEnum(EmailTemplate)
  template: EmailTemplate;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsObject()
  data: Record<string, any>;
}
