import * as Nest from '@nestjs/common';
import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { CurrencyId } from '@domain/currency-id.enum';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';
import { ExchangeCurrencyService } from '../exchange-currency.service';

Tests.serviceScope('ExchangeCurrencyService', () => {
  let exchangeCurrencyService: ExchangeCurrencyService;

  beforeAll(() => {
    exchangeCurrencyService = new ExchangeCurrencyService();
  });

  describe('exchange', () => {
    it('Should be able to get a Money when exchange is called', () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(
        exchangeCurrencyService.exchange(brlMoney, brlCurrency, arsCurrency),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to ARS Money', () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(
        exchangeCurrencyService.exchange(brlMoney, brlCurrency, arsCurrency),
      ).toEqual({
        currency: CurrencyId.ARS,
        value: 6964,
      });
    });

    it('Should be able to throw a DomainException if a domain error occurs', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(() => {
        exchangeCurrencyService.exchange(
          new Money(CurrencyId.USD, 183.26),
          brlCurrency,
          arsCurrency,
        );
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a InternalServerErrorException if an unknown error occurs', () => {
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(() => {
        exchangeCurrencyService.exchange(
          new Money(CurrencyId.BRL, 183.26),
          undefined,
          arsCurrency,
        );
      }).toThrowError(Nest.InternalServerErrorException);
    });
  });
});
