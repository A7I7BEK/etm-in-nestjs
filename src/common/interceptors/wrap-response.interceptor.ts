import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Pagination } from '../pagination/pagination.class';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>
    {
        return next.handle().pipe(map(data =>
        {
            if (data instanceof Pagination)
            {
                return data;
            }
            return { data };
        }));
    }
}
