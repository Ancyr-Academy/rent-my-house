type State = {
  id: string;
  emailAddress: string;
};

export class User {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  getId() {
    return this.state.id;
  }

  getEmailAddress() {
    return this.state.emailAddress;
  }
}
