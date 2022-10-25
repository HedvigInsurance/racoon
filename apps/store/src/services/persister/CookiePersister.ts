import { setCookie, getCookie, removeCookies } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'
import { SimplePersister } from './Persister.types'

export class CookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public save(value: string, cookieKey = this.cookieKey, options?: OptionsType) {
    setCookie(cookieKey, value, { ...this.defaultOptions(), ...options })
  }

  public fetch(cookieKey = this.cookieKey) {
    const cookieValue = getCookie(cookieKey, this.defaultOptions())
    if (typeof cookieValue === 'string') return cookieValue
    return null
  }

  public reset(cookieKey = this.cookieKey) {
    removeCookies(cookieKey, this.defaultOptions())
  }

  private defaultOptions() {
    return { path: '/' }
  }
}
