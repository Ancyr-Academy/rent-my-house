export class Mail {
  constructor(
    private readonly state: {
      to: string;
      from: string;
      subject: string;
      body: string;
    },
  ) {}

  getTo() {
    return this.state.to;
  }

  getFrom() {
    return this.state.from;
  }

  getSubject() {
    return this.state.subject;
  }
}
