import { EmailTemplate } from '../../domain/value-objects/email-template.enum';

export class SendEmailNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly recipient: string,
    public readonly template: EmailTemplate,
    public readonly subject: string,
    public readonly data: Record<string, any>,
  ) {}
}
