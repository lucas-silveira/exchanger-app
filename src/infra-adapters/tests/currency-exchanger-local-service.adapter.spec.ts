import * as Nest from '@nestjs/common';
import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import {
  CurrencyId,
  Currency,
  Money,
  ExchangeCurrencyService,
  ExchangeMultiCurrencyService,
} from '@domain';
import { CurrencyExchangerLocalService } from '../currency-exchanger-local-service.adapter';

Tests.unitScope('CurrencyExchangerLocalService', () => {
  let currencyExchangerLocalService: CurrencyExchangerLocalService;

  beforeAll(() => {
    currencyExchangerLocalService = new CurrencyExchangerLocalService(
      new ExchangeMultiCurrencyService(new ExchangeCurrencyService()),
    );
  });

  describe('exchange', () => {
    it('Should be able to get a list of Money when exchange is called', async () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      const moneyList = await currencyExchangerLocalService.exchange(
        brlMoney,
        brlCurrency,
        [arsCurrency, penCurrency],
      );
      expect(moneyList).toBeInstanceOf(Array);
      expect(moneyList[0]).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to multiple currencies Money', async () => {
      const brlMoney = new Money(CurrencyId.BRL, 183.26);
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      await expect(
        currencyExchangerLocalService.exchange(brlMoney, brlCurrency, [
          arsCurrency,
          penCurrency,
        ]),
      ).resolves.toEqual([
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

    it('Should be able to throw a DomainException if a domain error occurs', async () => {
      const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.19);
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      await expect(
        currencyExchangerLocalService.exchange(
          new Money(CurrencyId.USD, 183.26),
          brlCurrency,
          [arsCurrency, penCurrency],
        ),
      ).rejects.toThrowError(DomainException);
    });

    it('Should be able to throw a InternalServerErrorException if an unknown error occurs', async () => {
      const arsCurrency = new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005);
      const penCurrency = new Currency(CurrencyId.PEN, 'Sol', 0.27);
      await expect(
        currencyExchangerLocalService.exchange(
          new Money(CurrencyId.BRL, 183.26),
          undefined,
          [arsCurrency, penCurrency],
        ),
      ).rejects.toThrowError(Nest.InternalServerErrorException);
    });
  });
});
