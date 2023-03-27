import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { ErrorLog } from '@shared/telemetry';
import { Currency } from '@domain/currency.entity';
import { Money } from '@domain/money.vo';
import { ExchangeCurrencyService } from './exchange-currency.service';

@Nest.Injectable()
export class MultiCurrencyExchangerService {
  private readonly logger = new NestAddons.AppLogger(
    MultiCurrencyExchangerService.name,
  );

  constructor(
    private readonly currencyExchangerService: ExchangeCurrencyService,
  ) {}

  public exchange(
    money: Money,
    source: Currency,
    targets: Currency[],
  ): Money[] {
    try {
      return targets.map((tgt) =>
        this.currencyExchangerService.exchange(money, source, tgt),
      );
    } catch (err) {
      const targetsId = targets.map((tgt) => tgt.isoCode);
      this.logger.error(
        new ErrorLog(err, `Error while exchanging currencies`, {
          money,
          source,
          targetsId,
        }),
      );

      if (err instanceof Nest.HttpException) throw err;

      throw new Nest.InternalServerErrorException(
        `Error while exchanging currencies`,
      );
    }
  }
}
