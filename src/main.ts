import * as Nest from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as NestAddons from '@shared/nest-addons';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule.register());
  configApp(app);
  configOpenApi(app);

  const config = app.get<ConfigService>(ConfigService);
  await app.listen(config.get('app.httpPort') || 3000);
}

function configApp(app: Nest.INestApplication): void {
  app.enableCors();
  app.useLogger(app.get(NestAddons.AppLogger));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new Nest.ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
}

function configOpenApi(app: Nest.INestApplication): void {
  const docConf = new DocumentBuilder()
    .setTitle('Exchanger API')
    .setDescription('The Exchanger API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docConf);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
