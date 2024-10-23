import { Reservation } from '../../../domain/entities/reservation';
import { IReservationRepository } from '../../../application/ports/reservation-repository';

export class RamReservationRepository implements IReservationRepository {
  constructor(public readonly database: Reservation[] = []) {}

  async save(entity: Reservation): Promise<void> {
    const idx = this.database.findIndex(
      (reservation) => reservation.getId() === entity.getId(),
    );

    if (idx >= 0) {
      this.database[idx] = entity;
      return;
    }

    this.database.push(entity);
  }

  async findById(id: string): Promise<Reservation | null> {
    const entity =
      this.database.find((reservation) => reservation.getId() === id) || null;

    if (!entity) {
      return null;
    }

    return entity.clone();
  }
}
