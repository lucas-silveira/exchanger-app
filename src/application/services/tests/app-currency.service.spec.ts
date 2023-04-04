import * as Nest from '@nestjs/common';
import * as Tests from '@shared/testing';
import { Currency, CurrencyId, Money } from '@domain';
import * as Ports from '@application/ports';
import { AppCurrencyService } from '../app-currency.service';

Tests.serviceScope('AppCurrencyService', () => {
  let currenciesRepo: Ports.ICurrenciesRepository;
  let currencyExchangerService: Ports.ICurrencyExchangerService;
  let appCurrencyService: AppCurrencyService;

  beforeAll(() => {
    currenciesRepo = {
      save: jest.fn(),
      findAll: jest.fn(),
    };
    currencyExchangerService = {
      exchange: jest.fn(),
    };
    appCurrencyService = new AppCurrencyService(
      currenciesRepo,
      currencyExchangerService,
    );
  });

  it('Should be able to get a list of Money when exchange is called', async () => {
    jest
      .spyOn(currenciesRepo, 'findAll')
      .mockResolvedValueOnce([
        new Currency(CurrencyId.BRL, 'Real', 0.19),
        new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
        new Currency(CurrencyId.PEN, 'Sol', 0.27),
      ]);
    jest
      .spyOn(currencyExchangerService, 'exchange')
      .mockResolvedValueOnce([
        new Money(CurrencyId.ARS, 6964),
        new Money(CurrencyId.PEN, 128.96),
      ]);
    const dto = {
      amount: 183.26,
      source: CurrencyId.BRL,
    };

    const moneyList = await appCurrencyService.exchange(dto);
    expect(moneyList).toBeInstanceOf(Array);
    expect(moneyList[0]).toBeInstanceOf(Money);
  });

  it('Should be able to exchange a BRL Money to multiple currencies Money', async () => {
    jest
      .spyOn(currenciesRepo, 'findAll')
      .mockResolvedValueOnce([
        new Currency(CurrencyId.BRL, 'Real', 0.19),
        new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
        new Currency(CurrencyId.PEN, 'Sol', 0.27),
      ]);
    jest
      .spyOn(currencyExchangerService, 'exchange')
      .mockResolvedValueOnce([
        new Money(CurrencyId.ARS, 6964),
        new Money(CurrencyId.PEN, 128.96),
      ]);
    const dto = {
      amount: 183.26,
      source: CurrencyId.BRL,
    };
    await expect(appCurrencyService.exchange(dto)).resolves.toEqual([
      {
        currency: 'ARS',
        value: 6964,
      },
      {
        currency: 'PEN',
        value: 128.96,
      },
    ]);
  });

  it('Should be able to throw a BadRequestException if the source not exists', async () => {
    jest
      .spyOn(currenciesRepo, 'findAll')
      .mockResolvedValueOnce([
        new Currency(CurrencyId.BRL, 'Real', 0.19),
        new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
        new Currency(CurrencyId.PEN, 'Sol', 0.27),
      ]);
    jest
      .spyOn(currencyExchangerService, 'exchange')
      .mockResolvedValueOnce([
        new Money(CurrencyId.ARS, 6964),
        new Money(CurrencyId.PEN, 128.96),
      ]);
    const missingSource = CurrencyId.AED;
    const dto = {
      amount: 183.26,
      source: missingSource,
    };
    await expect(appCurrencyService.exchange(dto)).rejects.toThrowError(
      Nest.BadRequestException,
    );
  });

  it('Should be able to throw any internal HttpException', async () => {
    jest
      .spyOn(currenciesRepo, 'findAll')
      .mockRejectedValueOnce(new Nest.BadGatewayException());
    const dto = {
      amount: 183.26,
      source: CurrencyId.BRL,
    };
    await expect(appCurrencyService.exchange(dto)).rejects.toThrowError(
      Nest.BadGatewayException,
    );
  });

  it('Should be able to throw a InternalServerErrorException if an unknown error occurs', async () => {
    jest
      .spyOn(currenciesRepo, 'findAll')
      .mockResolvedValueOnce([
        new Currency(CurrencyId.BRL, 'Real', 0.19),
        new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
        new Currency(CurrencyId.PEN, 'Sol', 0.27),
      ]);
    jest
      .spyOn(currencyExchangerService, 'exchange')
      .mockResolvedValueOnce([
        new Money(CurrencyId.ARS, 6964),
        new Money(CurrencyId.PEN, 128.96),
      ]);
    const dto = undefined;
    await expect(appCurrencyService.exchange(dto)).rejects.toThrowError(
      Nest.InternalServerErrorException,
    );
  });
});
