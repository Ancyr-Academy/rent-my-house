import { IIdProvider } from './id-provider';

export class FixedIdProvider implements IIdProvider {
  constructor(public readonly ID = '2') {}

  nextId(): string {
    return this.ID;
  }
}
