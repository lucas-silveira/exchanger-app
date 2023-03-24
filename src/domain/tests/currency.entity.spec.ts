import * as Tests from '@shared/testing';
import { DomainException } from '@shared/infra-objects';
import { Money } from '../money.vo';
import { Currency } from '../currency.entity';

Tests.unitScope('Currency', () => {
  describe('creation', () => {
    it('Should be able to create a Currency correctly', () => {
      expect(new Currency('BRL', 'Real', 5)).toEqual({
        isoCode: 'BRL',
        name: 'Real',
        usdRate: 5,
      });
      expect(new Currency('brl', 'Real', 5)).toEqual({
        isoCode: 'BRL',
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
      expect(() => new Currency('BRL', undefined, 5)).toThrowError(
        DomainException,
      );
    });

    it('Should be able to throw a DomainException if we pass an empty usdRate', () => {
      expect(() => new Currency('BRL', 'Real', undefined)).toThrowError(
        DomainException,
      );
    });
  });

  describe('type validation', () => {
    it('Should be able to throw a DomainException if we pass an invalid isoCode', () => {
      expect(() => new Currency('BR', 'Real', 5)).toThrowError(DomainException);
      expect(() => new Currency('BRLR', 'Real', 5)).toThrowError(
        DomainException,
      );
      expect(() => new Currency('BR1', 'Real', 5)).toThrowError(
        DomainException,
      );
    });

    it('Should be able to throw a DomainException if we pass an invalid usdRate', () => {
      expect(() => new Currency('BRL', 'Real', -1)).toThrowError(
        DomainException,
      );
      expect(() => new Currency('BRL', 'Real', '123' as any)).toThrowError(
        DomainException,
      );
    });
  });

  describe('exchangeToUsd', () => {
    it('Should be able to get a Money when exchangeToUsd is called', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const brlMoney = new Money('BRL', 183.26);
      expect(brlCurrency.exchangeToUsd(brlMoney)).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to an USD Money', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const brlMoney = new Money('BRL', 183.26);
      expect(brlCurrency.exchangeToUsd(brlMoney)).toEqual({
        currency: 'USD',
        value: 34.82,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeToUsd(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money is not valid', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeToUsd(new Money('ARS', 183.26));
      }).toThrowError(DomainException);
    });
  });

  describe('exchangeFromUsd', () => {
    it('Should be able to get a Money when exchangeFromUsd is called', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const usdMoney = new Money('USD', 34.82);
      expect(brlCurrency.exchangeFromUsd(usdMoney)).toBeInstanceOf(Money);
    });

    it('Should be able to exchange an USD Money to BRL Money', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const usdMoney = new Money('USD', 34.82);
      expect(brlCurrency.exchangeFromUsd(usdMoney)).toEqual({
        currency: 'BRL',
        value: 183.26,
      });
    });

    it('Should be able to throw a DomainException if target Money is empty', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeFromUsd(undefined);
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a DomainException if target Money is not USD', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      expect(() => {
        brlCurrency.exchangeFromUsd(new Money('BRL', 183.26));
      }).toThrowError(DomainException);
    });
  });
});
