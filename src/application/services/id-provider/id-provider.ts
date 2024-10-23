export const I_ID_PROVIDER = 'IIdProvider';

export interface IIdProvider {
  nextId(): string;
}
