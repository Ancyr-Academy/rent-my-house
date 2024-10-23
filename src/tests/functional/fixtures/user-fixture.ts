import { IFixture } from '../../runner/fixture.interface';
import { User } from '../../../domain/entities/user';
import { ITester } from '../../runner/tester.interface';
import { I_USER_REPOSITORY, IUserRepository } from '../../../application/ports/user-repository';

export class UserFixture implements IFixture {
  constructor(public readonly entity: User) {}

  async load(tester: ITester): Promise<void> {
    const repository = tester.get<IUserRepository>(I_USER_REPOSITORY);
    await repository.save(this.entity);
  }
}
