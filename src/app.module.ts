import * as Nest from '@nestjs/common';

export class AppModule {
  public static imports: Nest.DynamicModule[] = [];
  public static controllers: Nest.Type[] = [];
  public static providers: Nest.Provider[] = [];

  public static register(): Nest.DynamicModule {
    return {
      module: AppModule,
      imports: AppModule.imports,
      controllers: AppModule.controllers,
      providers: AppModule.providers,
    };
  }
}
