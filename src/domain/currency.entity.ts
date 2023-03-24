import { AggregateRoot, Validator } from '@shared/domain-objects';
import { DomainException } from '@shared/infra-objects';
import { CurrencyID } from './currency-id.type';
import { Money } from './money.vo';

export class Currency extends AggregateRoot {
  public isoCode: CurrencyID;
  public name: string;
  public usdRate: number;

  constructor(isoCode: CurrencyID, name: string, usdRate: number) {
    super(undefined);
    this.setIsoCode(isoCode);
    this.setName(name);
    this.setUsdRate(usdRate);
  }

  public override isEqualTo(aCurrency: Currency): boolean {
    return this.isoCode === aCurrency.isoCode;
  }

  private setIsoCode(anIsoCode: CurrencyID): void {
    Validator.checkIfIsNotEmpty(anIsoCode, 'The incoming isoCode is empty');
    Validator.checkIfHasOnlyLetters(
      anIsoCode,
      'The incoming isoCode is not a valid ISO format.',
    );
    Validator.checkIfLengthIsNotGreaterThan(
      anIsoCode,
      3,
      'The incoming isoCode is not a valid ISO format.',
    );
    Validator.checkIfLengthIsNotLessThan(
      anIsoCode,
      3,
      'The incoming isoCode is not a valid ISO format.',
    );
    this.isoCode = anIsoCode.toUpperCase();
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
    return newMoney.toCurrency('USD');
  }

  public exchangeFromUsd(source: Money): Money {
    Validator.checkIfIsNotEmpty(source, 'The source money is empty');
    if (source.currency !== 'USD')
      throw new DomainException(`The source money is not an USD currency`);

    const newMoney = source.divide(this.usdRate);
    return newMoney.toCurrency(this.isoCode);
  }
}
