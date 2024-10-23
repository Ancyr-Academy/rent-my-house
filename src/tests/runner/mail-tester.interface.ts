export type DidSendMailConfig = { to: string; from: string; subject: string };

export interface IMailTester {
  /**
   * Asserts the inbox contains only one message
   * Throws if the inbox is empty or contains more than one message
   * Return the message otherwise
   */
  didSendMail(config: DidSendMailConfig): any;
}
