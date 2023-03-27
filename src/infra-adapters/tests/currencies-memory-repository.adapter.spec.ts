import * as Tests from '@shared/testing';
import { Currency, CurrencyId } from '@domain';
import { CurrenciesMemoryRepository } from '../currencies-memory-repository.adapter';

Tests.serviceScope('CurrenciesMemoryRepository', () => {
  let currenciesMemRepo: CurrenciesMemoryRepository;

  beforeEach(() => {
    currenciesMemRepo = new CurrenciesMemoryRepository();
  });

  it('Should be able to save a Currency', async () => {
    await expect(
      currenciesMemRepo.save(new Currency(CurrencyId.BRL, 'Real', 0.5)),
    ).resolves.not.toThrow();
  });

  it('Should be able to get a list of Currency when findAll is called', async () => {
    await currenciesMemRepo.save(new Currency(CurrencyId.BRL, 'Real', 0.19));
    await currenciesMemRepo.save(
      new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
    );
    await currenciesMemRepo.save(new Currency(CurrencyId.USD, 'Dólar', 1));
    const currenciesList = await currenciesMemRepo.findAll();
    expect(currenciesList).toBeInstanceOf(Array);
    expect(currenciesList[0]).toBeInstanceOf(Currency);
  });

  it('Should be able to find all Currencies saved', async () => {
    await currenciesMemRepo.save(new Currency(CurrencyId.BRL, 'Real', 0.19));
    await currenciesMemRepo.save(
      new Currency(CurrencyId.ARS, 'Peso Argentino', 0.005),
    );
    await currenciesMemRepo.save(new Currency(CurrencyId.USD, 'Dólar', 1));
    await expect(currenciesMemRepo.findAll()).resolves.toEqual([
      {
        isoCode: 'BRL',
        name: 'Real',
        usdRate: 0.19,
      },
      {
        isoCode: 'ARS',
        name: 'Peso Argentino',
        usdRate: 0.005,
      },
      {
        isoCode: 'USD',
        name: 'Dólar',
        usdRate: 1,
      },
    ]);
  });

  it('Should be able to save a Currency twice', async () => {
    const brlCurrency = new Currency(CurrencyId.BRL, 'Real', 0.5);
    await currenciesMemRepo.save(brlCurrency);
    let [savedBRLCurrency] = await currenciesMemRepo.findAll();
    expect(savedBRLCurrency).toBe(brlCurrency);

    brlCurrency.name = 'Real 2';
    await currenciesMemRepo.save(brlCurrency);
    [savedBRLCurrency] = await currenciesMemRepo.findAll();
    expect(savedBRLCurrency).toBe(brlCurrency);
  });
});
