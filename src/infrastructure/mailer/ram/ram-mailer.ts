import { Mail } from '../../../domain/models/mail';
import { IMailer } from '../../../application/ports/mailer';

export class RamMailer implements IMailer {
  constructor(private readonly mails: Mail[] = []) {}

  didSendMail(config: { to: string; from: string; subject: string }) {
    return this.mails.some((mail) => {
      return (
        mail.getTo() === config.to &&
        mail.getFrom() === config.from &&
        mail.getSubject() === config.subject
      );
    });
  }

  async send(mail: Mail): Promise<void> {
    this.mails.push(mail);
  }
}
