import Cookies from 'js-cookie'
import { SimplePersister } from './Persister.types'

export class CookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public save(value: string, cookieKey = this.cookieKey, options?: Cookies.CookieAttributes) {
    Cookies.set(cookieKey, value, { path: '/', ...options })
  }

  public fetch(cookieKey = this.cookieKey) {
    return Cookies.get(cookieKey) ?? null
  }

  public reset(cookieKey = this.cookieKey) {
    Cookies.remove(cookieKey)
  }
}
