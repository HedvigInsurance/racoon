import { cookies } from 'next/headers'

export class AppRouterCookiePersister {
  constructor(private readonly cookieKey: string) {}

  public save(value: string, cookieKey = this.cookieKey) {
    cookies().set(cookieKey, value)
  }

  public fetch(cookieKey = this.cookieKey) {
    const cookieValue = cookies().get(cookieKey)
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
