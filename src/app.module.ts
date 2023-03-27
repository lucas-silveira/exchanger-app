import * as Nest from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as NestAddons from '@shared/nest-addons';
import * as Domain from '@domain';
import * as App from '@application';
import * as InfraAdapters from '@infra-adapters';
import { makeConfigAndValidate } from './config';

export class AppModule {
  public static imports: Nest.DynamicModule[] = [
    ConfigModule.forRoot({
      envFilePath: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
      isGlobal: true,
      load: [makeConfigAndValidate],
    }),
  ];

  public static controllers: Nest.Type[] = [];

  public static providers: Nest.Provider[] = [
    NestAddons.AppLogger,
    Domain.ExchangeCurrencyService,
    Domain.ExchangeMultiCurrencyService,
    {
      provide: App.Ports.CurrencyExchangerServiceKey,
      useClass: InfraAdapters.CurrencyExchangerLocalService,
    },
    {
      provide: App.Ports.CurrenciesRepositoryKey,
      useClass: InfraAdapters.CurrenciesMemoryRepository,
    },
  ];

  public static register(): Nest.DynamicModule {
    return {
      module: AppModule,
      imports: AppModule.imports,
      controllers: AppModule.controllers,
      providers: AppModule.providers,
    };
  }
}
