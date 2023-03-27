import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { ErrorLog } from '@shared/telemetry';
import { Money, Currency, MultiCurrencyExchangerService } from '@domain';
import { ICurrencyExchangerService } from '@application/ports';

/*
  This adapter allows us to decouple the Application layer from Domain layer
  in order to make it easier to change the implementation of the exchange operation.
*/

@Nest.Injectable()
export class LocalCurrencyExchangerServiceAdapter
  implements ICurrencyExchangerService
{
  private readonly logger = new NestAddons.AppLogger(
    LocalCurrencyExchangerServiceAdapter.name,
  );

  constructor(
    private readonly multiCurrencyExchangerService: MultiCurrencyExchangerService,
  ) {}

  public exchange(
    money: Money,
    source: Currency,
    targets: Currency[],
  ): Promise<Money[]> {
    try {
      return Promise.resolve(
        this.multiCurrencyExchangerService.exchange(money, source, targets),
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
