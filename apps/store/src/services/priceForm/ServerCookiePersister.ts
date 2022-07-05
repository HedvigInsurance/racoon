import { GetServerSidePropsContext } from 'next'
import { COOKIE_KEY_LATEST } from './priceForm.constants'
import { Persister, SaveParams } from './priceForm.types'

export class ServerCookiePersister<Data> implements Persister<Data> {
  constructor(
    private readonly request: GetServerSidePropsContext['req'],
    private readonly response: GetServerSidePropsContext['res'],
  ) {}

  public async save({ id, data }: SaveParams<Data>) {
    this.response.setHeader('Set-Cookie', [
      `${id}=${JSON.stringify(data)}`,
      `${COOKIE_KEY_LATEST}=${id}`,
    ])
  }

  public async fetch(id: string) {
    const json = this.request.cookies[id]
    return json ? (JSON.parse(json) as Data) : null
  }

  public async fetchLatest() {
    const dataId = this.request.cookies[COOKIE_KEY_LATEST]
    return dataId ?? null
  }

  public async reset() {
    const dataId = await this.fetchLatest()
    if (dataId) this.response.setHeader('Set-Cookie', [`${dataId}=; Max-Age=0`])
    this.response.setHeader('Set-Cookie', [`${COOKIE_KEY_LATEST}=; Max-Age=0`])
  }
}
