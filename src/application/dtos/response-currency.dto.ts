import { CurrencyId } from '@domain';

export class ResponseCurrencyDto {
  public readonly isoCode: CurrencyId;
  public readonly name: string;
  public readonly usdRate: number;

  constructor(isoCode: CurrencyId, name: string, usdRate: number) {
    Object.assign(this, { isoCode, name, usdRate });
  }
}
