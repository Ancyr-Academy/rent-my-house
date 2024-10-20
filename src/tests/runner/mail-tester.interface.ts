export interface IMailTester {
  /**
   * Asserts the inbox contains only one message
   * Throws if the inbox is empty or contains more than one message
   * Return the message otherwise
   */
  assertOnlyOne(): any;
}
