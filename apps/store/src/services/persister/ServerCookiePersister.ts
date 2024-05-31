import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next'
import { type DefaultOptions } from 'cookies-next/lib/types'
import { type CookieParams } from '@/utils/types'
import { type SimplePersister } from './Persister.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: CookieParams['req'],
    private readonly response: CookieParams['res'],
    private readonly cookieMaxAgeSeconds: number,
  ) {}

  public save(value: string, cookieKey = this.cookieKey, options?: DefaultOptions) {
    setCookie(cookieKey, value, {
      ...this.defaultOptions(),
      ...options,
    })
  }

  public fetch(cookieKey = this.cookieKey) {
    const cookieValue = getCookie(cookieKey, this.defaultOptions())
    return typeof cookieValue === 'string' ? cookieValue : null
  }

  public reset(cookieKey = this.cookieKey) {
    deleteCookie(cookieKey, this.defaultOptions())
  }

  private defaultOptions(): DefaultOptions {
    return { path: '/', req: this.request, res: this.response, maxAge: this.cookieMaxAgeSeconds }
  }

  public getAll() {
    return getCookies(this.defaultOptions())
  }
}
