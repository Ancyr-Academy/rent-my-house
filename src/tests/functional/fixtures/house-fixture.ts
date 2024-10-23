import { IFixture } from '../../runner/fixture.interface';
import { ITester } from '../../runner/tester.interface';
import { House } from '../../../domain/entities/house';
import {
  I_HOUSE_REPOSITORY,
  IHouseRepository,
} from '../../../application/ports/house-repository';

export class HouseFixture implements IFixture {
  constructor(public readonly entity: House) {}

  async load(tester: ITester): Promise<void> {
    const repository = tester.get<IHouseRepository>(I_HOUSE_REPOSITORY);
    await repository.save(this.entity);
  }
}
