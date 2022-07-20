import Cookies from 'js-cookie'
import { SimplePersister } from './priceIntent.types'

export class CookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public async save(id: string) {
    Cookies.set(this.cookieKey, id, { path: '/' })
  }

  public async fetch() {
    return Cookies.get(this.cookieKey) ?? null
  }

  public async reset() {
    Cookies.remove(this.cookieKey)
  }
}
