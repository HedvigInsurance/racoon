import { GetServerSidePropsContext } from 'next'
import { SimplePersister } from './Persister.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: GetServerSidePropsContext['req'],
    private readonly response: GetServerSidePropsContext['res'],
  ) {}

  public save(id: string, cookieKey = this.cookieKey) {
    const rawHeader = this.response.getHeader('Set-Cookie')
    const existingHeaders = Array.isArray(rawHeader) ? rawHeader : []
    this.response.setHeader('Set-Cookie', [...existingHeaders, `${cookieKey}=${id}; Path=/`])
  }

  public fetch(cookieKey = this.cookieKey) {
    return this.request.cookies[cookieKey] ?? null
  }

  public reset(cookieKey = this.cookieKey) {
    this.response.setHeader('Set-Cookie', [`${cookieKey}=; Max-Age=0`])
  }
}
