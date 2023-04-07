import * as Tests from '@shared/testing';
import { Currency, CurrencyId } from '@domain';
import { CurrenciesMemoryRepository } from '../currencies-memory-repository.adapter';

Tests.serviceScope('CurrenciesMemoryRepository', () => {
  let currenciesMemRepo: CurrenciesMemoryRepository;

  beforeEach(() => {
    currenciesMemRepo = new CurrenciesMemoryRepository();
  });

  it('Should be able to save a new Currency', async () => {
    await expect(
      currenciesMemRepo.save(
        new Currency(CurrencyId.CAD, 'Dólar Canadense', 0.74),
      ),
    ).resolves.not.toThrow();
  });

  it('Should be able to get true if a Currency exists', async () => {
    await expect(currenciesMemRepo.exists(CurrencyId.BRL)).resolves.toBe(true);
  });

  it('Should be able to get false if a Currency not exists', async () => {
    await expect(currenciesMemRepo.exists(CurrencyId.CAD)).resolves.toBe(false);
  });

  it('Should be able to get a list of Currency when findAll is called', async () => {
    const currenciesList = await currenciesMemRepo.findAll();
    expect(currenciesList).toBeInstanceOf(Array);
    expect(currenciesList[0]).toBeInstanceOf(Currency);
  });

  it('Should be able to find all Currencies saved', async () => {
    await expect(currenciesMemRepo.findAll()).resolves.toEqual([
      {
        isoCode: 'USD',
        name: 'Dólar',
        usdRate: 1,
      },
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
        isoCode: 'PEN',
        name: 'Sol',
        usdRate: 0.27,
      },
    ]);
  });

  it('Should be able to save a Currency twice', async () => {
    const cadCurrency = new Currency(CurrencyId.CAD, 'Dólar Canadense', 0.74);
    await currenciesMemRepo.save(cadCurrency);
    let savedCADCurrency = (await currenciesMemRepo.findAll()).find((curr) =>
      curr.isEqualTo(cadCurrency),
    );
    expect(savedCADCurrency).toBe(cadCurrency);

    cadCurrency.name = 'Dólar Canadense 2';
    await currenciesMemRepo.save(cadCurrency);
    savedCADCurrency = (await currenciesMemRepo.findAll()).find((curr) =>
      curr.isEqualTo(cadCurrency),
    );
    expect(savedCADCurrency).toBe(cadCurrency);
  });
});
