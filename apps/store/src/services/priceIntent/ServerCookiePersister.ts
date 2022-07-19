import { GetServerSidePropsContext } from 'next'
import { SimplePersister } from './priceIntent.types'

export class ServerCookiePersister implements SimplePersister {
  constructor(
    private readonly cookieKey: string,
    private readonly request: GetServerSidePropsContext['req'],
    private readonly response: GetServerSidePropsContext['res'],
  ) {}

  public async save(id: string) {
    this.response.setHeader('Set-Cookie', [`${this.cookieKey}=${id}; Path=/`])
  }

  public async fetch() {
    return this.request.cookies[this.cookieKey] ?? null
  }

  public async reset() {
    this.response.setHeader('Set-Cookie', [`${this.cookieKey}=; Max-Age=0`])
  }
}
