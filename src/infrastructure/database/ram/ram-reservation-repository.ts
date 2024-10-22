import { Reservation } from '../../../domain/entities/reservation';
import { IReservationRepository } from '../../../application/ports/reservation-repository';

export class RamReservationRepository implements IReservationRepository {
  constructor(public readonly database: Reservation[] = []) {}

  async save(entity: Reservation): Promise<void> {
    this.database.push(entity);
  }

  async findById(id: string): Promise<Reservation | null> {
    return (
      this.database.find((reservation) => reservation.getId() === id) || null
    );
  }
}
