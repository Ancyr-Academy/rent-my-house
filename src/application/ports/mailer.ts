import { Mail } from '../../domain/models/mail';

export interface IMailer {
  send(mail: Mail): Promise<void>;
}