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
    status: 'PENDING' | 'ACCEPTED';
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
      status: 'PENDING',
      startDate,
      endDate,
    });
  }

  isReservationAccepted(reservationId: string) {
    const entry = this.state.entries.find(
      (entry) => entry.type === 'reservation' && entry.id === reservationId,
    );

    return entry?.status === 'ACCEPTED';
  }

  markAsAccepted(id: string) {
    this.state.entries = this.state.entries.map((entry) => {
      if (entry.type === 'reservation' && entry.id === id) {
        return {
          ...entry,
          status: 'ACCEPTED',
        };
      }

      return entry;
    });
  }

  clone() {
    return new HouseCalendar({
      houseId: this.state.houseId,
      entries: this.state.entries.map((entry) => ({
        ...entry,
      })),
    });
  }
}
