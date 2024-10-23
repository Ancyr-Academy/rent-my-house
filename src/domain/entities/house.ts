type State = {
  id: string;
  hostId: string;
};

export class House {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  getId() {
    return this.state.id;
  }

  getHostId() {
    return this.state.hostId;
  }

  isHost(id: string) {
    return this.state.hostId === id;
  }
}
