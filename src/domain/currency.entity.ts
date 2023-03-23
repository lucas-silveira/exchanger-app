import { AggregateRoot, Validator } from '@shared/domain-objects';
import { CurrencyID } from './currency-id.type';

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
}
