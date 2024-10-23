import { Mail } from '../../../domain/models/mail';
import { IMailer } from '../../../application/ports/mailer';

type DidSendMailConfig = { to: string; from: string; subject: string };

export class RamMailer implements IMailer {
  constructor(private readonly mails: Mail[] = []) {}

  didSendMail(config: DidSendMailConfig) {
    return this.mails.some((mail) => {
      return (
        mail.getTo() === config.to &&
        mail.getFrom() === config.from &&
        mail.getSubject() === config.subject
      );
    });
  }

  getMails() {
    return this.mails;
  }
  async send(mail: Mail): Promise<void> {
    this.mails.push(mail);
  }
}
