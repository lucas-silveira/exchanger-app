import { AggregateRoot, Validator } from '@shared/domain-objects';
import { DomainException } from '@shared/infra-objects';
import { CurrencyId } from './currency-id.enum';
import { Money } from './money.vo';

export class Currency extends AggregateRoot {
  public isoCode: CurrencyId;
  public name: string;
  public usdRate: number;

  constructor(isoCode: CurrencyId, name: string, usdRate: number) {
    super(undefined);
    this.setIsoCode(isoCode);
    this.setName(name);
    this.setUsdRate(usdRate);
  }

  public override isEqualTo(aCurrency: Currency): boolean {
    return this.isoCode === aCurrency.isoCode;
  }

  private setIsoCode(anIsoCode: CurrencyId): void {
    Validator.checkIfIsNotEmpty(anIsoCode, 'The incoming isoCode is empty');
    Validator.checkIfIsValidEnum(
      CurrencyId,
      anIsoCode,
      'The incoming isoCode is not a valid CurrencyId.',
    );
    this.isoCode = anIsoCode;
  }

  private setName(aName: string): void {
    Validator.checkIfIsNotEmpty(aName, 'The incoming name is empty');
    this.name = aName;
  }

  private setUsdRate(anUsdValue: number): void {
    Validator.checkIfIsNotEmpty(anUsdValue, 'The incoming usdRate is empty');
    Validator.checkIfIsNumber(
      anUsdValue,
      'The incoming usdRate is not a valid number',
    );
    Validator.checkIfIsNotLessThan(
      anUsdValue,
      0,
      'The incoming usdRate is less than 0',
    );
    this.usdRate = anUsdValue;
  }

  public exchangeToUsd(source: Money): Money {
    Validator.checkIfIsNotEmpty(source, 'The source money is empty');
    if (source.currency !== this.isoCode)
      throw new DomainException(
        `The source money has a different currency: ${source.currency}`,
      );

    const newMoney = source.multiply(this.usdRate);
    return newMoney.toCurrency(CurrencyId.USD);
  }

  public exchangeFromUsd(source: Money): Money {
    Validator.checkIfIsNotEmpty(source, 'The source money is empty');
    if (source.currency !== CurrencyId.USD)
      throw new DomainException(`The source money is not an USD currency`);

    const newMoney = source.divide(this.usdRate);
    return newMoney.toCurrency(this.isoCode);
  }
}
