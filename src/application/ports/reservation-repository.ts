import { Reservation } from '../../domain/entities/reservation';

export interface IReservationRepository {
  save(entity: Reservation): Promise<void>;
}