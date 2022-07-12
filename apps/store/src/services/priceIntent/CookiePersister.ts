import Cookies from 'js-cookie'
import { COOKIE_KEY_LATEST } from './priceIntent.constants'
import { Persister, SaveParams } from './priceIntent.types'

export class CookiePersister<Data> implements Persister<Data> {
  public async save({ id, data }: SaveParams<Data>) {
    Cookies.set(id, JSON.stringify(data), { path: '/' })
    Cookies.set(COOKIE_KEY_LATEST, id, { path: '/' })
  }

  public async fetch(id: string) {
    const json = Cookies.get(id)
    if (!json) return null
    return JSON.parse(json) as Data
  }

  public async fetchLatest() {
    const dataId = Cookies.get(COOKIE_KEY_LATEST)
    return dataId ?? null
  }

  public async reset() {
    const dataId = await this.fetchLatest()
    if (dataId) Cookies.remove(dataId)
    Cookies.remove(COOKIE_KEY_LATEST)
  }
}
