import { setCookie, getCookie, deleteCookie, getCookies } from 'cookies-next'
import type { OptionsType } from 'cookies-next/lib/types'
import type { SimplePersister } from './Persister.types'

export class CookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly cookieMaxAgeSeconds: number,
  ) {}

  public save(value: string, cookieKey = this.cookieKey, options?: OptionsType) {
    setCookie(cookieKey, value, { ...this.defaultOptions(), ...options })
  }

  public fetch(cookieKey = this.cookieKey) {
    const cookieValue = getCookie(cookieKey, this.defaultOptions())
    if (typeof cookieValue === 'string') return cookieValue
    return null
  }

  public reset(cookieKey = this.cookieKey) {
    deleteCookie(cookieKey, this.defaultOptions())
  }

  private defaultOptions() {
    return { path: '/', maxAge: this.cookieMaxAgeSeconds }
  }

  public getAll() {
    return getCookies(this.defaultOptions())
  }
}
