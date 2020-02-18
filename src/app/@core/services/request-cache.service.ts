import { Injectable } from '@angular/core'
import { HttpRequest, HttpResponse } from '@angular/common/http'

const maxAge = 300000
export interface CacheEntry {
    url: string
    response: HttpResponse<any>
    lastRead: number
}

@Injectable()
export class RequestCacheService {
    cache = new Map<string, CacheEntry>()

    get(request: HttpRequest<any>): HttpResponse<any> | undefined {
        const url = request.urlWithParams
        const cached = this.cache.get(url)

        if (!cached) {
            return undefined
        }

        const isExpired = cached.lastRead < (Date.now() - maxAge)
        if (isExpired) {
            this.cache.delete(cached.url)
            return undefined
        }

        return cached.response
    }

    put(request: HttpRequest<any>, response: HttpResponse<any>): void {
        const url = request.urlWithParams
        const entry = {
            url,
            response,
            lastRead: Date.now()
        }
        this.cache.set(url, entry)

        const expiration = Date.now() - maxAge
        this.cache.forEach(entry => {
            if (entry.lastRead <= expiration) {
                this.cache.delete(entry.url)
            }
        })
    }
}