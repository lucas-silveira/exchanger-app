import * as Utils from '@shared/utils';
import { Validator, ValueObject } from '@shared/domain-objects';
import { DomainException } from '@shared/infra-objects';
import { CurrencyID } from './currency-id.type';

export class Money extends ValueObject {
  public readonly currency: CurrencyID;
  public readonly value: number;

  constructor(currency: CurrencyID, value: number) {
    super();
    this.setCurrency(currency);
    this.setValue(value);
  }

  private setCurrency(aCurrency: CurrencyID): void {
    Validator.checkIfIsNotEmpty(aCurrency, 'The incoming currency is empty');
    Validator.checkIfHasOnlyLetters(
      aCurrency,
      'The incoming currency is not a valid ISO format.',
    );
    Validator.checkIfLengthIsNotGreaterThan(
      aCurrency,
      3,
      'The incoming currency is not a valid ISO format.',
    );
    Validator.checkIfLengthIsNotLessThan(
      aCurrency,
      3,
      'The incoming currency is not a valid ISO format.',
    );
    super.setReadOnlyProperty('currency', aCurrency.toUpperCase());
  }

  private setValue(aValue: number): void {
    Validator.checkIfIsNotEmpty(aValue, 'The incoming value is empty');
    Validator.checkIfIsNumber(
      aValue,
      'The incoming value is not a valid number',
    );
    Validator.checkIfIsNotLessThan(
      aValue,
      0,
      'The incoming value is less than 0',
    );
    super.setReadOnlyProperty('value', Utils.Math.round(aValue));
  }

  public toString(): string {
    return `${this.currency}$${this.value}`;
  }

  public toCurrency(aCurrency: CurrencyID): Money {
    return new Money(aCurrency, this.value);
  }

  public plus(aMoney: Money): Money {
    Validator.checkIfIsNotEmpty(aMoney, 'The target money is empty');
    if (aMoney.currency !== this.currency)
      throw new DomainException(
        `The target money has a different currency: ${aMoney.toString()}`,
      );

    return new Money(this.currency, this.value + aMoney.value);
  }

  public discount(aMoney: Money): Money {
    Validator.checkIfIsNotEmpty(aMoney, 'The target money is empty');
    if (aMoney.currency !== this.currency)
      throw new DomainException(
        `The target money has a different currency: ${aMoney.currency}`,
      );
    Validator.checkIfIsNotGreaterThan(
      aMoney.value,
      this.value,
      `The target money ${aMoney.toString()} is greater than current money ${this.toString()}`,
    );

    return new Money(this.currency, this.value - aMoney.value);
  }

  public multiply(aNumber: number): Money {
    Validator.checkIfIsNotEmpty(aNumber, 'The target number is empty');
    Validator.checkIfIsNumber(
      aNumber,
      'The target number is not a valid number',
    );
    Validator.checkIfIsNotLessThan(
      aNumber,
      0,
      'The target number is less than 0',
    );

    return new Money(this.currency, this.value * aNumber);
  }

  public divide(aNumber: number): Money {
    Validator.checkIfIsNotEmpty(aNumber, 'The target number is empty');
    Validator.checkIfIsNumber(
      aNumber,
      'The target number is not a valid number',
    );
    Validator.checkIfIsNotLessThan(
      aNumber,
      0,
      'The target number is less than 0',
    );

    return new Money(this.currency, this.value / aNumber);
  }
}
