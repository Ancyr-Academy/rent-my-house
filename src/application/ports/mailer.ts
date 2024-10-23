import { Mail } from '../../domain/models/mail';

export const I_MAILER = 'IMailer';

export interface IMailer {
  send(mail: Mail): Promise<void>;
}
