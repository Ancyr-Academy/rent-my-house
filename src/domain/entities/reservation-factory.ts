import { Reservation, State } from './reservation';

export class ReservationFactory {
  static create(data?: Partial<State>) {
    return new Reservation({
      id: 'reservation-id',
      houseId: 'house-id',
      tenantId: 'tenant-id',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      status: 'PENDING',
      ...data,
    });
  }
}
