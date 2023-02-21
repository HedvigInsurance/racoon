import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { CookieParams } from '@/utils/types'
import { SimplePersister } from './Persister.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: CookieParams['req'],
    private readonly response: CookieParams['res'],
  ) {}

  public save(value: string, cookieKey = this.cookieKey, options?: OptionsType) {
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

  private defaultOptions() {
    return { path: '/', req: this.request, res: this.response }
  }

  public getAll() {
    return getCookies(this.defaultOptions())
  }
}
