import * as Nest from '@nestjs/common';
import * as NestAddons from '@shared/nest-addons';
import { ErrorLog } from '@shared/telemetry';
import { Currency, CurrencyId, Money } from '@domain';
import * as DTOs from '../dtos';
import * as Ports from '../ports';

@Nest.Injectable()
export class AppCurrencyService {
  private readonly logger = new NestAddons.AppLogger(AppCurrencyService.name);

  constructor(
    @Nest.Inject(Ports.CurrenciesRepositoryKey)
    private readonly currenciesRepo: Ports.ICurrenciesRepository,
    @Nest.Inject(Ports.CurrencyExchangerServiceKey)
    private readonly currencyExchangerService: Ports.ICurrencyExchangerService,
  ) {}

  public async exchange(
    dto: DTOs.RequestExchangeDto,
  ): Promise<DTOs.ResponseMoneyDto[]> {
    try {
      const money = new Money(dto.source, dto.amount);
      const allCurrencies = await this.currenciesRepo.findAll();
      const source = this.getSourceCurrency(allCurrencies, dto.source);
      const targets = this.getTargetCurrencies(allCurrencies, source);

      const moneyList = await this.currencyExchangerService.exchange(
        money,
        source,
        targets,
      );

      return this.makeMoneyDtoList(moneyList);
    } catch (err) {
      this.logger.error(
        new ErrorLog(err, `Error while exchanging currencies`, { dto }),
      );

      if (err instanceof Nest.HttpException) throw err;

      throw new Nest.InternalServerErrorException(
        `Error while exchanging currencies`,
      );
    }
  }

  private getSourceCurrency(
    currencies: Currency[],
    source: CurrencyId,
  ): Currency {
    const sourceCurr = currencies.find((curr) => curr.isoCode === source);

    if (!sourceCurr)
      throw new Nest.BadRequestException(
        `The ${source} source currency not exists`,
      );

    return sourceCurr;
  }

  private getTargetCurrencies(
    currencies: Currency[],
    source: Currency,
  ): Currency[] {
    return currencies.filter((curr) => !curr.isEqualTo(source));
  }

  private makeMoneyDtoList(moneyList: Money[]): DTOs.ResponseMoneyDto[] {
    return moneyList.map((m) => new DTOs.ResponseMoneyDto(m.currency, m.value));
  }
}
