import * as Nest from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as camelcaseKeys from 'camelcase-keys';

@Nest.Injectable()
export class HttpRequestCamelCaseInterceptor implements Nest.NestInterceptor {
  intercept(
    context: Nest.ExecutionContext,
    next: Nest.CallHandler,
  ): Observable<any> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      request.body = camelcaseKeys(request.body, { deep: true });
    }
    return next.handle();
  }
}
