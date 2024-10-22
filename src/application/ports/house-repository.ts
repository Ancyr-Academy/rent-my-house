import { House } from '../../domain/entities/house';

export interface IHouseRepository {
  findById(id: string): Promise<House | null>;
}