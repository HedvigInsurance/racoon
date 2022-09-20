import Cookies from 'js-cookie'
import { SimplePersister } from './Persister.types'

export class CookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public save(id: string, cookieKey = this.cookieKey) {
    Cookies.set(cookieKey, id, { path: '/' })
  }

  public fetch(cookieKey = this.cookieKey) {
    return Cookies.get(cookieKey) ?? null
  }

  public reset(cookieKey = this.cookieKey) {
    Cookies.remove(cookieKey)
  }
}
