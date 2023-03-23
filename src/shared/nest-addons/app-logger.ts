import * as Nest from '@nestjs/common';

export class AppLogger extends Nest.ConsoleLogger {
  log(log: unknown): void {
    const logSerialized = JSON.stringify(log);
    super.log(logSerialized);
  }

  error(log: unknown): void {
    const logSerialized = JSON.stringify(log);
    super.error(logSerialized);
  }
}
