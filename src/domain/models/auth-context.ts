type State = {
  id: string;
  emailAddress: string;
};

export class AuthContext {
  constructor(private readonly state: State) {}

  getId() {
    return this.state.id;
  }

  getEmailAddress() {
    return this.state.emailAddress;
  }
}
