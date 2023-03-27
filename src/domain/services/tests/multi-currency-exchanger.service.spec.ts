import * as Nest from '@nestjs/common';
import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { CurrencyId } from '@domain/currency-id.enum';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';
import { ExchangeCurrencyService } from '../exchange-currency.service';
import { MultiCurrencyExchangerService } from '../multi-currency-exchanger.service';

Tests.serviceScope('MultiCurrencyExchangerService', () => {
  let multiCurrencyExchangerService: MultiCurrencyExchangerService;

  beforeAll(() => {
    multiCurrencyExchangerService = new MultiCurrencyExchangerService(
      new ExchangeCurrencyService(),
    );
  });

  describe('exchange', () => {
    it('Should be able to get a list of Money when exchange is called', () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      const moneyList = multiCurrencyExchangerService.exchange(
        brlMoney,
        brlCurrency,
        [arsCurrency, penCurrency],
      );
      expect(moneyList).toBeInstanceOf(Array);
      expect(moneyList[0]).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to multiple currencies Money', () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      expect(
        multiCurrencyExchangerService.exchange(brlMoney, brlCurrency, [
          arsCurrency,
          penCurrency,
        ]),
      ).toEqual([
        {
          currency: CurrencyId.ARS,
          value: 6964,
        },
        {
          currency: CurrencyId.PEN,
          value: 128.96,
        },
      ]);
    });

    it('Should be able to throw a DomainException if a domain error occurs', () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      expect(() => {
        multiCurrencyExchangerService.exchange(
          new Money(CurrencyId.USD, 183.26),
          brlCurrency,
          [arsCurrency, penCurrency],
        );
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a InternalServerErrorException if an unknown error occurs', () => {
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      expect(() => {
        multiCurrencyExchangerService.exchange(
          new Money(CurrencyId.BRL, 183.26),
          undefined,
          [arsCurrency, penCurrency],
        );
      }).toThrowError(Nest.InternalServerErrorException);
    });
  });
});
