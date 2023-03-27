import { Currency } from '@domain';

export interface ICurrenciesRepository {
  save(currency: Currency): Promise<void>;
  findAll(): Promise<Currency[]>;
}
