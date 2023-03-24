import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { CurrencyId } from '@domain/currency-id.enum';
import { Money } from '../money.vo';

Tests.unitScope('Money', () => {
  describe('creation', () => {
    it('Should be able to create a Money correctly', () => {
      expect(new Money(CurrencyId.BRL, 10)).toEqual({
        currency: CurrencyId.BRL,
        value: 10,
      });
    });
  });

  describe('empty validation', () => {
    it('Should be able to throw a DomainException if we pass an empty currency', () => {
      expect(() => new Money(undefined, 10)).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if we pass an empty value', () => {
      expect(() => new Money(CurrencyId.BRL, undefined)).toThrowError(
        DomainException,
      );
    });
  });

  describe('type validation', () => {
    it('Should be able to throw a DomainException if we pass an invalid currency', () => {
      expect(() => new Money('BR' as any, 10)).toThrowError(DomainException);
      expect(() => new Money('BRLR' as any, 10)).toThrowError(DomainException);
      expect(() => new Money('BR1' as any, 10)).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if we pass an invalid value', () => {
      expect(() => new Money(CurrencyId.BRL, -1)).toThrowError(DomainException);
      expect(() => new Money(CurrencyId.BRL, '123' as any)).toThrowError(
        DomainException,
      );
    });
  });

  describe('toString', () => {
    it('Should be able to get a string representation', () => {
      expect(new Money(CurrencyId.BRL, 10.2).toString()).toBe('BRL$10.2');
    });
  });

  describe('toCurrency', () => {
    it('Should be able to get another Money when toCurrency is called', () => {
      expect(
        new Money(CurrencyId.BRL, 10).toCurrency(CurrencyId.USD),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to convert the currency', () => {
      expect(new Money(CurrencyId.BRL, 10).toCurrency(CurrencyId.USD)).toEqual({
        currency: CurrencyId.USD,
        value: 10,
      });
    });
  });

  describe('plus', () => {
    it('Should be able to get another Money when plus is called', () => {
      expect(
        new Money(CurrencyId.BRL, 10).plus(new Money(CurrencyId.BRL, 2)),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to plus a Money with another Money', () => {
      expect(
        new Money(CurrencyId.BRL, 10).plus(new Money(CurrencyId.BRL, 2.89)),
      ).toEqual({
        currency: CurrencyId.BRL,
        value: 12.89,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).plus(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money`s currency is different of source Money', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).plus(new Money(CurrencyId.ARS, 2));
      }).toThrowError(DomainException);
    });
  });

  describe('discount', () => {
    it('Should be able to get another Money when discount is called', () => {
      expect(
        new Money(CurrencyId.BRL, 10).discount(new Money(CurrencyId.BRL, 2)),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to discount a Money with another Money', () => {
      expect(
        new Money(CurrencyId.BRL, 10).discount(new Money(CurrencyId.BRL, 2.89)),
      ).toEqual({
        currency: CurrencyId.BRL,
        value: 7.11,
      });
    });

    it('Should be able to discount the total Money', () => {
      expect(
        new Money(CurrencyId.BRL, 10).discount(new Money(CurrencyId.BRL, 10)),
      ).toEqual({
        currency: CurrencyId.BRL,
        value: 0,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).discount(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money`s currency is different of source Money', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).discount(new Money(CurrencyId.ARS, 2));
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if discount Money is greater than source Money', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).discount(new Money(CurrencyId.BRL, 11));
      }).toThrowError(DomainException);
    });
  });

  describe('multiply', () => {
    it('Should be able to get another Money when multiply is called', () => {
      expect(new Money(CurrencyId.BRL, 10).multiply(2)).toBeInstanceOf(Money);
    });

    it('Should be able to multiply a Money by a number', () => {
      expect(new Money(CurrencyId.BRL, 10).multiply(2)).toEqual({
        currency: CurrencyId.BRL,
        value: 20,
      });
    });

    it('Should be able to throw a DomainException if target number is empty', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).multiply(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target number is not valid', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).multiply('ab' as any);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target number is less than 0', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).multiply(-1);
      }).toThrowError(DomainException);
    });
  });

  describe('divide', () => {
    it('Should be able to get another Money when divide is called', () => {
      expect(new Money(CurrencyId.BRL, 10).divide(2)).toBeInstanceOf(Money);
    });

    it('Should be able to divide a Money by a number', () => {
      expect(new Money(CurrencyId.BRL, 10).divide(2)).toEqual({
        currency: CurrencyId.BRL,
        value: 5,
      });
    });

    it('Should be able to throw a DomainException if target number is empty', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).divide(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target number is not valid', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).divide('ab' as any);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target number is less than 0', () => {
      expect(() => {
        new Money(CurrencyId.BRL, 10).divide(-1);
      }).toThrowError(DomainException);
    });
  });
});
