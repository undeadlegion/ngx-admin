import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { RequestCacheService } from './request-cache.service'
import { tap } from 'rxjs/operators'


@Injectable()
export class RequestCacheInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCacheService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('[request-interceptor] intercepting request: ', request.urlWithParams)
        const cached = this.cache.get(request)
        if (cached) {
            console.log('  [request-interceptor] found in cache, consuming request')
            return of(cached)
        }
        console.log('  [request-interceptor] not in cache, forwarding request')
        return next.handle(request).pipe(
            tap(response => {
                if (response instanceof HttpResponse) {
                    this.cache.put(request, response)
                    console.log('  [request-interceptor] request completed, cached response for: ', request.urlWithParams)
                }
            })
        )
    }
}