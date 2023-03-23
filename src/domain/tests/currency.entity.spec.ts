import * as Tests from '@shared/testing';
import { DomainException } from '@shared/infra-objects';
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
});
