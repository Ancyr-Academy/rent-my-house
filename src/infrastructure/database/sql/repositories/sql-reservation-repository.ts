import { EntityManager, EntityRepository, ref } from '@mikro-orm/postgresql';
import { SqlUser } from '../entities/sql-user';
import { SqlHouse } from '../entities/sql-house';
import { IReservationRepository } from '../../../../application/ports/reservation-repository';
import { SqlReservation } from '../entities/sql-reservation';
import { Reservation, Status } from '../../../../domain/entities/reservation';

export class SqlReservationRepository implements IReservationRepository {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly repository: EntityRepository<SqlReservation>,
  ) {}

  async findById(id: string): Promise<Reservation | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }

    return new Reservation({
      id: entity.id,
      houseId: entity.house.id,
      tenantId: entity.tenant.id,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status as Status,
    });
  }

  async save(reservation: Reservation): Promise<void> {
    let record: SqlReservation = await this.repository.findOne({
      id: reservation.getId(),
    });
    if (!record) {
      record = new SqlReservation();
    }

    record.id = reservation.getId();
    record.house = ref(SqlHouse, reservation.getHouseId());
    record.tenant = ref(SqlUser, reservation.getTenantId());
    record.startDate = reservation.getStartDate();
    record.endDate = reservation.getEndDate();
    record.status = reservation.getStatus();

    await this.entityManager.persistAndFlush(record);
  }
}
