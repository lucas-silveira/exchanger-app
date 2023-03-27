import { Currency } from '@domain';

export const CurrenciesRepositoryKey = 'CurrenciesRepository';
export interface ICurrenciesRepository {
  save(currency: Currency): Promise<void>;
  findAll(): Promise<Currency[]>;
}
