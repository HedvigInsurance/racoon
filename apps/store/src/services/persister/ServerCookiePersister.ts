import Cookies from 'js-cookie'
import { GetServerSidePropsContext } from 'next'
import { SimplePersister } from './Persister.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: GetServerSidePropsContext['req'],
    private readonly response: GetServerSidePropsContext['res'],
  ) {}

  public save(value: string, cookieKey = this.cookieKey, options?: Cookies.CookieAttributes) {
    const rawHeader = this.response.getHeader('Set-Cookie')
    const existingHeaders = Array.isArray(rawHeader) ? rawHeader : []
    const { expires } = options || {}
    this.response.setHeader('Set-Cookie', [
      ...existingHeaders,
      `${cookieKey}=${value}; Max-Age=${this.calculateMaxAge(expires)} Path=/`,
    ])
  }

  public fetch(cookieKey = this.cookieKey) {
    return this.request.cookies[cookieKey] ?? null
  }

  public reset(cookieKey = this.cookieKey) {
    this.response.setHeader('Set-Cookie', [`${cookieKey}=; Max-Age=0`])
  }

  /**
   * Converts a Date into Unix Epoc since that's what Max-Age expects
   * @param value Possible values for expires option. If number, treated as number of days to conform to js-cookie's implementation
   * @returns Undefined or number: milliseconds until expiry
   */
  private calculateMaxAge(value: number | Date | undefined) {
    if (typeof value === 'undefined') return value
    if (typeof value === 'number') return value * 1000 * 60 * 60 * 24

    return value.getTime()
  }
}
