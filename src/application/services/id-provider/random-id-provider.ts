import { IIdProvider } from './id-provider';
import { randomUUID } from 'node:crypto';

export class RandomIdProvider implements IIdProvider {
  nextId(): string {
    return randomUUID();
  }
}
