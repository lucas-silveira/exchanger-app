import * as Nest from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as NestAddons from '@shared/nest-addons';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.register());
  const config = app.get<ConfigService>(ConfigService);
  app.enableCors();
  app.useLogger(app.get(NestAddons.AppLogger));
  app.useGlobalInterceptors(
    new NestAddons.Interceptors.HttpRequestCamelCaseInterceptor(),
    new NestAddons.Interceptors.HttpResponseSnakeCaseInterceptor(),
  );
  app.useGlobalPipes(
    new Nest.ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(config.get('app.httpPort') || 3000);
}
bootstrap();
