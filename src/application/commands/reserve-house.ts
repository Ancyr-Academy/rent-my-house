import { Reservation } from '../../domain/entities/reservation';
import { IIdProvider } from '../services/id-provider/id-provider';
import { IHouseRepository } from '../ports/house-repository';
import { IReservationRepository } from '../ports/reservation-repository';
import { AuthContext } from '../../domain/models/auth-context';

export class ReserveHouseCommand {
  constructor(
    public readonly props: {
      houseId: string;
      startDate: string;
      endDate: string;
    },
    public readonly auth: AuthContext,
  ) {}
}

export class ReserveHouseCommandHandler {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly houseRepository: IHouseRepository,
    private readonly idProvider: IIdProvider,
  ) {}

  async execute({ props, auth }: ReserveHouseCommand) {
    const house = await this.houseRepository.findById(props.houseId);
    if (house === null) {
      throw new Error('House not found');
    }

    const reservation = new Reservation({
      id: this.idProvider.nextId(),
      tenantId: auth.getId(),
      houseId: props.houseId,
      startDate: new Date(props.startDate),
      endDate: new Date(props.endDate),
    });

    await this.reservationRepository.save(reservation);
  }
}
