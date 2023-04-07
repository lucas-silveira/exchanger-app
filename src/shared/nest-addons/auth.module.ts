import * as Nest from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth-basic.strategy';

export class AuthModule {
  private static imports: Nest.DynamicModule[] = [PassportModule.register({})];
  private static providers: Nest.Provider[] = [BasicStrategy];

  public static register(): Nest.DynamicModule {
    return {
      module: AuthModule,
      imports: AuthModule.imports,
      providers: AuthModule.providers,
    };
  }
}
