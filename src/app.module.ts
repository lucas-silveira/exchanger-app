import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';

export class AppModule {
  public static imports: Nest.DynamicModule[] = [];
  public static controllers: Nest.Type[] = [];
  public static providers: Nest.Provider[] = [NestAddons.AppLogger];

  public static register(): Nest.DynamicModule {
    return {
      module: AppModule,
      imports: AppModule.imports,
      controllers: AppModule.controllers,
      providers: AppModule.providers,
    };
  }
}
