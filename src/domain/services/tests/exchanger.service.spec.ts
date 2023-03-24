import * as Nest from '@nestjs/common';
import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { CurrencyId } from '@domain/currency-id.enum';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';
import { CurrencyExchangerService } from '../currency-exchanger.service';

Tests.serviceScope('CurrencyExchangerService', () => {
  let currencyExchangerService: CurrencyExchangerService;

  beforeAll(() => {
    currencyExchangerService = new CurrencyExchangerService();
  });

  describe('exchange', () => {
    it('Should be able to get a Money when exchange is called', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      expect(
        currencyExchangerService.exchange(brlCurrency, arsCurrency, brlMoney),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to ARS Money', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      expect(
        currencyExchangerService.exchange(brlCurrency, arsCurrency, brlMoney),
      ).toEqual({
        currency: CurrencyId.ARS,
        value: 6964,
      });
    });

    it('Should be able to throw a DomainException if a domain error occurs', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(() => {
        currencyExchangerService.exchange(
          brlCurrency,
          arsCurrency,
          new Money(CurrencyId.USD, 183.26),
        );
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a InternalServerErrorException if an unknown error occurs', () => {
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      expect(() => {
        currencyExchangerService.exchange(
          undefined,
          arsCurrency,
          new Money(CurrencyId.BRL, 183.26),
        );
      }).toThrowError(Nest.InternalServerErrorException);
    });
  });
});