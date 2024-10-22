type State = {
  id: string;
};

export class AuthContext {
  constructor(private readonly state: State) {}

  getId() {
    return this.state.id;
  }
}
