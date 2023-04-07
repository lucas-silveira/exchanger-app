import { CurrencyId } from '@domain';

export class ResponseMoneyDto {
  public readonly currency: CurrencyId;
  public readonly value: number;

  constructor(currency: CurrencyId, value: number) {
    Object.assign(this, currency, value);
  }
}
