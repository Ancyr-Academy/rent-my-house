export type Entry = {
  type: 'reservation';
  id: string;
  startDate: Date;
  endDate: Date;
};

export type State = {
  houseId: string;
  entries: Array<{
    type: 'reservation';
    id: string;
    startDate: Date;
    endDate: Date;
  }>;
};

export class HouseCalendar {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  getId() {
    return this.state.houseId;
  }

  getEntries() {
    return this.state.entries;
  }

  isAvailable(startDate: Date, endDate: Date) {
    const entries = Object.values(this.state.entries);

    for (const entry of entries) {
      if (
        startDate.getTime() <= entry.endDate.getTime() &&
        endDate.getTime() >= entry.startDate.getTime()
      ) {
        return false;
      }
    }

    return true;
  }

  book(reservationId: string, startDate: Date, endDate: Date) {
    this.state.entries.push({
      type: 'reservation',
      id: reservationId,
      startDate,
      endDate,
    });
  }
}
