import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { ErrorLog } from '@shared/telemetry';
import { Money, Currency, ExchangeMultiCurrencyService } from '@domain';
import { ICurrencyExchangerService } from '@application/ports';

/*
  This adapter allows us to decouple the Application layer from Domain layer
  in order to make it easier to change the implementation of the exchange operation.
*/

@Nest.Injectable()
export class CurrencyExchangerLocalService
  implements ICurrencyExchangerService
{
  private readonly logger = new NestAddons.AppLogger(
    CurrencyExchangerLocalService.name,
  );

  constructor(
    private readonly exchangeMultiCurrencyService: ExchangeMultiCurrencyService,
  ) {}

  public async exchange(
    money: Money,
    source: Currency,
    targets: Currency[],
  ): Promise<Money[]> {
    try {
      return this.exchangeMultiCurrencyService.exchange(money, source, targets);
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
