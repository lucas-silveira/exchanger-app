import { Money, Currency } from '@domain';

export interface ICurrencyExchangerService {
  exchange(
    money: Money,
    source: Currency,
    targets: Currency[],
  ): Promise<Money[]>;
}
