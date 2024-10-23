export type Status = 'PENDING' | 'ACCEPTED' | 'REFUSED';

export type State = {
  id: string;
  houseId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  status: Status;
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

  getStatus() {
    return this.state.status;
  }

  isAccepted() {
    return this.state.status === 'ACCEPTED';
  }

  accept() {
    this.state.status = 'ACCEPTED';
  }

  clone() {
    return new Reservation({ ...this.state });
  }

  isRefused() {
    return this.state.status === 'REFUSED';
  }
}
