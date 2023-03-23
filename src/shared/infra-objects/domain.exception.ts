import * as Nest from '@nestjs/common';

export class DomainException extends Nest.HttpException {
  constructor(message: string) {
    super(
      { error: 'Unprocessable Entity', message },
      Nest.HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
