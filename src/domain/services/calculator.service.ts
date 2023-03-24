import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { ErrorLog } from '@shared/telemetry';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';

@Nest.Injectable()
export class CalculatorService {
  private readonly logger = new NestAddons.AppLogger(CalculatorService.name);

  public exchange(source: Currency, target: Currency, money: Money): Money {
    try {
      const usdMoney = source.exchangeToUsd(money);
      return target.exchangeFromUsd(usdMoney);
    } catch (err) {
      this.logger.error(
        new ErrorLog(err, `Error while exchanging currencies`, {
          source,
          target,
          money,
        }),
      );

      if (err instanceof Nest.HttpException) throw err;

      throw new Nest.InternalServerErrorException(
        `Error while exchanging currencies`,
      );
    }
  }
}
