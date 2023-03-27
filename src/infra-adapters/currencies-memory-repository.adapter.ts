import * as Nest from '@nestjs/common';
import { Currency } from '@domain';
import { Ports } from '@application';

@Nest.Injectable()
export class CurrenciesMemoryRepository implements Ports.ICurrenciesRepository {
  private currencies = new Map<string, Currency>();

  public async save(currency: Currency): Promise<void> {
    if (!this.currencies.has(currency.isoCode))
      this.currencies.set(currency.isoCode, currency);
  }
  public async findAll(): Promise<Currency[]> {
    return Array.from(this.currencies, ([, value]) => value);
  }
}
