import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'

type SaveParams<Data> = {
  data: Data
}

const COOKIE_KEY = '_HEDVIG_CHECKOUT'

export class CookiePersister<Data> {
  constructor(
    private readonly request: NextApiRequest | GetServerSidePropsContext['req'],
    private readonly response: NextApiResponse | GetServerSidePropsContext['res'],
  ) {}

  public async save({ data }: SaveParams<Data>) {
    this.response.setHeader('Set-Cookie', `${COOKIE_KEY}=${JSON.stringify(data)}; Path=/; HttpOnly`)
  }

  public async fetch() {
    const json = this.request.cookies[COOKIE_KEY]
    return json ? (JSON.parse(json) as Data) : null
  }
}
