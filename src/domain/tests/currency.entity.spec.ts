import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { CurrencyId } from '@domain/currency-id.enum';
import { Currency } from '../currency.entity';
import { Money } from '../money.vo';

Tests.unitScope('Currency', () => {
  describe('creation', () => {
    it('Should be able to create a Currency correctly', () => {
      expect(new Currency(CurrencyId.BRL, 'Real', 5)).toEqual({
        isoCode: CurrencyId.BRL,
        name: 'Real',
        usdRate: 5,
      });
      expect(new Currency(CurrencyId.BRL, 'Real', 5)).toEqual({
        isoCode: CurrencyId.BRL,
        name: 'Real',
        usdRate: 5,
      });
    });
  });

  describe('empty validation', () => {
    it('Should be able to throw a DomainException if we pass an empty isoCode', () => {
      expect(() => new Currency(undefined, 'Real', 5)).toThrowError(
        DomainException,
      );
    });

    it('Should be able to throw a DomainException if we pass an empty name', () => {
      expect(() => new Currency(CurrencyId.BRL, undefined, 5)).toThrowError(
        DomainException,
      );
    });

    it('Should be able to throw a DomainException if we pass an empty usdRate', () => {
      expect(
        () => new Currency(CurrencyId.BRL, 'Real', undefined),
      ).toThrowError(DomainException);
    });
  });

  describe('type validation', () => {
    it('Should be able to throw a DomainException if we pass an invalid isoCode', () => {
      expect(() => new Currency('BR' as any, 'Real', 5)).toThrowError(
        DomainException,
      );
      expect(() => new Currency('BRLR' as any, 'Real', 5)).toThrowError(
        DomainException,
      );
      expect(() => new Currency('BR1' as any, 'Real', 5)).toThrowError(
        DomainException,
      );
    });

    it('Should be able to throw a DomainException if we pass an invalid usdRate', () => {
      expect(() => new Currency(CurrencyId.BRL, 'Real', -1)).toThrowError(
        DomainException,
      );
      expect(
        () => new Currency(CurrencyId.BRL, 'Real', '123' as any),
      ).toThrowError(DomainException);
    });
  });

  describe('exchangeToUsd', () => {
    it('Should be able to get a Money when exchangeToUsd is called', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      expect(brlCurrency.exchangeToUsd(brlMoney)).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to an USD Money', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      expect(brlCurrency.exchangeToUsd(brlMoney)).toEqual({
        currency: CurrencyId.USD,
        value: 34.82,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeToUsd(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money is not valid', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeToUsd(new Money(CurrencyId.ARS, 183.26));
      }).toThrowError(DomainException);
    });
  });

  describe('exchangeFromUsd', () => {
    it('Should be able to get a Money when exchangeFromUsd is called', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const usdMoney = new Money(CurrencyId.USD, 34.82);
      expect(brlCurrency.exchangeFromUsd(usdMoney)).toBeInstanceOf(Money);
    });

    it('Should be able to exchange an USD Money to BRL Money', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const usdMoney = new Money(CurrencyId.USD, 34.82);
      expect(brlCurrency.exchangeFromUsd(usdMoney)).toEqual({
        currency: CurrencyId.BRL,
        value: 183.26,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeFromUsd(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money is not USD', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeFromUsd(new Money(CurrencyId.BRL, 183.26));
      }).toThrowError(DomainException);
    });
  });
});
