import Cookies from 'js-cookie'
import { SimplePersister } from './Persister.types'

export class CookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public save(id: string) {
    Cookies.set(this.cookieKey, id, { path: '/' })
  }

  public fetch() {
    return Cookies.get(this.cookieKey) ?? null
  }

  public reset() {
    Cookies.remove(this.cookieKey)
  }
}
