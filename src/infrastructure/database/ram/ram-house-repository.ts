import { House } from '../../../domain/entities/house';
import { IHouseRepository } from '../../../application/ports/house-repository';

export class RamHouseRepository implements IHouseRepository {
  constructor(public readonly database: House[] = []) {}

  async findById(id: string): Promise<House | null> {
    return this.database.find((house) => house.getId() === id) || null;
  }

  async save(entity: House): Promise<void> {
    this.database.push(entity);
  }
}
