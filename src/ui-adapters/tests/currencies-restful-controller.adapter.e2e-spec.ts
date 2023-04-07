import * as Nest from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as NestAddons from '@shared/nest-addons';
import * as Tests from '@shared/testing';
import { Ports } from '@application';
import { CurrenciesMemoryRepository } from '@infra-adapters';
import { AppModule } from 'src/app.module';

Tests.e2eScope('CurrenciesRESTfulController', () => {
  let currenciesRepo: CurrenciesMemoryRepository;
  let app: Nest.INestApplication;

  beforeAll(async () => {
    currenciesRepo = new CurrenciesMemoryRepository();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register()],
    })
      .overrideProvider(Ports.CurrenciesRepositoryKey)
      .useValue(currenciesRepo)
      .compile();

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

  beforeEach(() => {
    currenciesRepo.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST currencies', () => {
    it('Should be able to create a new currency', () => {
      const dto = {
        isoCode: 'CAD',
        name: 'Dólar Canadense',
        usdRate: 0.74,
      };
      const expectedResponse = {
        isoCode: 'CAD',
        name: 'Dólar Canadense',
        usdRate: 0.74,
      };

      return request(app.getHttpServer())
        .post('/currencies')
        .send(dto)
        .expect(201)
        .expect(expectedResponse);
    });

    it('Should be able to throw a BadRequestException if the payload is invalid', () => {
      const dto = {
        isoCode: 'xxx',
        name: 'Dólar Canadense',
        usdRate: 0.74,
      };
      return request(app.getHttpServer())
        .post('/currencies')
        .send(dto)
        .expect(400);
    });

    it('Should be able to throw any internal HttpException', () => {
      const dto = {
        isoCode: 'BRL', // BRL currency already exists
        name: 'Real',
        usdRate: 5,
      };
      return request(app.getHttpServer())
        .post('/currencies')
        .send(dto)
        .expect(400);
    });
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
        source: 'xxx',
        amount: 10,
      };
      return request(app.getHttpServer())
        .post('/currencies/exchange')
        .send(dto)
        .expect(400);
    });

    it('Should be able to throw any internal HttpException', () => {
      const dto = {
        source: 'CAD', // Although CAD is a valid currency code, there is no CAD currency saved
        amount: 10,
      };
      return request(app.getHttpServer())
        .post('/currencies/exchange')
        .send(dto)
        .expect(400);
    });
  });
});
