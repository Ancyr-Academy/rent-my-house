type State = {
  id: string;
  houseId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
};

export class Reservation {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  getId() {
    return this.state.id;
  }

  getStartDate() {
    return this.state.startDate;
  }

  getEndDate() {
    return this.state.endDate;
  }

  getHouseId() {
    return this.state.houseId;
  }

  getTenantId() {
    return this.state.tenantId;
  }
}
