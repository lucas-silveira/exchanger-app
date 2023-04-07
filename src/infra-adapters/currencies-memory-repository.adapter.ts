import * as Nest from '@nestjs/common';
import { Currency, CurrencyId } from '@domain';
import { Ports } from '@application';

@Nest.Injectable()
export class CurrenciesMemoryRepository implements Ports.ICurrenciesRepository {
  private currencies = new Map<string, Currency>([
    [CurrencyId.USD, new Currency(CurrencyId.USD, 'Dólar', 1)],
    [CurrencyId.BRL, new Currency(CurrencyId.BRL, 'Real', 0.19)],
    [CurrencyId.ARS, new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005)],
    [CurrencyId.PEN, new Currency(CurrencyId.PEN, 'Sol', 0.27)],
  ]);

  public async save(currency: Currency): Promise<void> {
    if (!this.currencies.has(currency.isoCode))
      this.currencies.set(currency.isoCode, currency);
  }

  public async exists(isoCode: CurrencyId): Promise<boolean> {
    return !!this.currencies.has(isoCode);
  }

  public async findAll(): Promise<Currency[]> {
    return Array.from(this.currencies, ([, value]) => value);
  }
}
