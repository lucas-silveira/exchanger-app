import * as Nest from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import snakecaseKeys from 'snakecase-keys';

@Nest.Injectable()
export class HttpResponseSnakeCaseInterceptor implements Nest.NestInterceptor {
  intercept(
    context: Nest.ExecutionContext,
    next: Nest.CallHandler,
  ): Observable<any> {
    if (context.getType() === 'http') {
      return next
        .handle()
        .pipe(
          map((data) =>
            typeof data === 'object'
              ? snakecaseKeys(data, { deep: true })
              : data,
          ),
        );
    }
    return next.handle();
  }
}
