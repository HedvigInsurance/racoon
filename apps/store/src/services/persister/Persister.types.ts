import Cookies from 'js-cookie'

export interface SimplePersister {
  save(value: string, key?: string, options?: Cookies.CookieAttributes): void

  fetch(key?: string): string | null

  reset(key?: string): void
}
