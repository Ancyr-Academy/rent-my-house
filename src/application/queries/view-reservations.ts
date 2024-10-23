import { AuthContext } from '../../domain/models/auth-context';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ApiReservationDetails } from '../../domain/viewmodels/reservation-details';
import { SqlReservation } from '../../infrastructure/database/sql/entities/sql-reservation';

export class ViewReservationQuery {
  constructor(
    public readonly data: null,
    public readonly auth: AuthContext,
  ) {}
}

@Injectable()
export class ViewReservationQueryHandler {
  constructor(
    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}

  async execute({
    data,
    auth,
  }: ViewReservationQuery): Promise<ApiReservationDetails[]> {
    const reservations: SqlReservation[] = await this.entityManager
      .createQueryBuilder(SqlReservation, 'reservation')
      .leftJoinAndSelect('reservation.house', 'house')
      .leftJoinAndSelect('house.host', 'host')
      .where({ tenant: auth.getId() });

    return reservations.map((reservation) => {
      const house = reservation.house.unwrap();
      const host = house.host.unwrap();

      return {
        id: reservation.id,
        house: {
          id: reservation.house.id,
          hostEmailAddress: host.emailAddress,
        },
        startDate: reservation.startDate.toISOString().substring(0, 10),
        endDate: reservation.endDate.toISOString().substring(0, 10),
      };
    });
  }
}
