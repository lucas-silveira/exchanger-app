import { Money, Currency } from '@domain';

export const CurrencyExchangerServiceKey = 'CurrencyExchangerService';
export interface ICurrencyExchangerService {
  exchange(
    money: Money,
    source: Currency,
    targets: Currency[],
  ): Promise<Money[]>;
}
