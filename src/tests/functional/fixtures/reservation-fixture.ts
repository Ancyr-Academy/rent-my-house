import { IFixture } from '../../runner/fixture.interface';
import { ITester } from '../../runner/tester.interface';
import { Reservation } from '../../../domain/entities/reservation';
import {
  I_RESERVATION_REPOSITORY,
  IReservationRepository,
} from '../../../application/ports/reservation-repository';

export class ReservationFixture implements IFixture {
  constructor(public readonly entity: Reservation) {}

  async load(tester: ITester): Promise<void> {
    const repository = tester.get<IReservationRepository>(
      I_RESERVATION_REPOSITORY,
    );
    await repository.save(this.entity);
  }
}
