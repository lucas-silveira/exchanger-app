import * as Nest from '@nestjs/common';
import { DomainException } from '@shared/infra-objects';
import * as Tests from '@shared/testing';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';
import { CalculatorService } from '../calculator.service';

Tests.unitScope('CalculatorService', () => {
  let calculatorService: CalculatorService;

  beforeAll(() => {
    calculatorService = new CalculatorService();
  });

  describe('exchange', () => {
    it('Should be able to get a Money when exchange is called', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const arsCurrency = new Currency('ARS', 'Peso Argentino', 0.005);
      const brlMoney = new Money('BRL', 183.26);
      expect(
        calculatorService.exchange(brlCurrency, arsCurrency, brlMoney),
      ).toBeInstanceOf(Money);
    });

    it('Should be able to exchange a BRL Money to ARS Money', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const arsCurrency = new Currency('ARS', 'Peso Argentino', 0.005);
      const brlMoney = new Money('BRL', 183.26);
      expect(
        calculatorService.exchange(brlCurrency, arsCurrency, brlMoney),
      ).toEqual({
        currency: 'ARS',
        value: 6964,
      });
    });

    it('Should be able to throw a DomainException if a domain error occurs', () => {
      const brlCurrency = new Currency('BRL', 'Real', 0.19);
      const arsCurrency = new Currency('ARS', 'Peso Argentino', 0.005);
      expect(() => {
        calculatorService.exchange(
          brlCurrency,
          arsCurrency,
          new Money('USD', 183.26),
        );
      }).toThrowError(DomainException);
    });

    it('Should be able to throw a InternalServerErrorException if an unknown error occurs', () => {
      const arsCurrency = new Currency('ARS', 'Peso Argentino', 0.005);
      expect(() => {
        calculatorService.exchange(
          undefined,
          arsCurrency,
          new Money('BRL', 183.26),
        );
      }).toThrowError(Nest.InternalServerErrorException);
    });
  });
});
