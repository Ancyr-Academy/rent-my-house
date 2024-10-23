import { Reservation } from '../../domain/entities/reservation';

export const I_RESERVATION_REPOSITORY = 'IReservationRepository';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;

  save(entity: Reservation): Promise<void>;
}
