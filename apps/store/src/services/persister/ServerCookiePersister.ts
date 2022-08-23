import { GetServerSidePropsContext } from 'next'
import { SimplePersister } from './Persister.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: GetServerSidePropsContext['req'],
    private readonly response: GetServerSidePropsContext['res'],
  ) {}

  public save(id: string) {
    const rawHeader = this.response.getHeader('Set-Cookie')
    const existingHeaders = Array.isArray(rawHeader) ? rawHeader : []
    this.response.setHeader('Set-Cookie', [...existingHeaders, `${this.cookieKey}=${id}; Path=/`])
  }

  public fetch() {
    return this.request.cookies[this.cookieKey] ?? null
  }

  public reset() {
    this.response.setHeader('Set-Cookie', [`${this.cookieKey}=; Max-Age=0`])
  }
}
