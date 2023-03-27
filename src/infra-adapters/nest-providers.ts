import * as Nest from '@nestjs/common';
import { Ports } from '@application';
import { CurrenciesMemoryRepository } from './currencies-memory-repository.adapter';
import { CurrencyExchangerLocalService } from './currency-exchanger-local-service.adapter';

export const providers: Nest.Provider[] = [
  {
    provide: Ports.CurrencyExchangerServiceKey,
    useClass: CurrencyExchangerLocalService,
  },
  {
    provide: Ports.CurrenciesRepositoryKey,
    useClass: CurrenciesMemoryRepository,
  },
];
