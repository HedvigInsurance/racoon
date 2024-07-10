import { cookies } from 'next/headers'
import { type SimplePersister } from '../Persister.types'

export class AppRouterCookiePersister implements SimplePersister {
  constructor(private readonly cookieKey: string) {}

  public save(value: string, cookieKey = this.cookieKey) {
    cookies().set(cookieKey, value)
  }

  public fetch(cookieKey = this.cookieKey) {
    const cookieValue = cookies().get(cookieKey)?.value
    if (typeof cookieValue === 'string') return cookieValue
    return null
  }

  public reset(cookieKey = this.cookieKey) {
    cookies().delete(cookieKey)
  }

  public getAll() {
    return cookies().getAll()
  }
}
