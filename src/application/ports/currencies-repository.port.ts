import { Currency, CurrencyId } from '@domain';

export const CurrenciesRepositoryKey = 'CurrenciesRepository';
export interface ICurrenciesRepository {
  save(currency: Currency): Promise<void>;
  exists(isoCode: CurrencyId): Promise<boolean>;
  findAll(): Promise<Currency[]>;
}
