type State = {
  id: string;
};

export class House {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  getId() {
    return this.state.id;
  }
}
