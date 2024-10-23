import { House } from '../../domain/entities/house';

export const I_HOUSE_REPOSITORY = 'IHouseRepository';

export interface IHouseRepository {
  findById(id: string): Promise<House | null>;
  save(house: House): Promise<void>;
}
