import * as Nest from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as NestAddons from '@shared/nest-addons';
import * as Tests from '@shared/testing';
import { AppModule } from 'src/app.module';

Tests.e2eScope('CurrenciesRESTfulController', () => {
  let app: Nest.INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register()],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useLogger(app.get(NestAddons.AppLogger));
    app.useGlobalPipes(
      new Nest.ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST currencies/exchange', () => {
    it('Should be able to exchange a BRL value to multiple currencies', () => {
      const dto = {
        source: 'BRL',
        amount: 10,
      };
      const expectedResponse = [
        { currency: 'USD', value: 1.9 },
        { currency: 'ARS', value: 380 },
        { currency: 'PEN', value: 7.04 },
      ];
      return request(app.getHttpServer())
        .post('/currencies/exchange')
        .send(dto)
        .expect(201)
        .expect(expectedResponse);
    });

    it('Should be able to throw a BadRequestException if the payload is invalid', () => {
      const dto = {
        source: 'BRxx',
        amount: 10,
      };
      return request(app.getHttpServer())
        .post('/currencies/exchange')
        .send(dto)
        .expect(400);
    });

    it('Should be able to throw any internal HttpException', () => {
      const dto = {
        source: 'CAD', // Although CAD is a valid currency code, there is no CAD Currency saved
        amount: 10,
      };
      return request(app.getHttpServer())
        .post('/currencies/exchange')
        .send(dto)
        .expect(400);
    });
  });
});
