import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseProperties<T> {
  code: number;
  message: string;
  data: T | null;
  error: null;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseProperties<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseProperties<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;

        const message = typeof data === 'string' ? data : 'Request successful';

        const responseData = typeof data === 'string' ? null : data;

        return {
          code: statusCode,
          message: message,
          data: responseData,
          error: null,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
