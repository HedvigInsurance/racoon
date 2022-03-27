import { IncomingMessage, ServerResponse } from 'http'
import { getCookie, setCookies } from 'cookies-next'
import { EmbarkHistory } from 'embark-core'

const COOKIE_KEY = '_HEDVIG_EMBARK_HISTORY'

type SaveParams = {
  req: IncomingMessage
  res: ServerResponse
  session: Session
}

type GetParams = {
  req: IncomingMessage
  res: ServerResponse
}

type EmbarkStore = Record<string, any>

type SessionParams = {
  story: string
  initialData?: EmbarkStore
  history?: EmbarkHistory
}

class Session {
  public readonly story: string
  private _initialData: EmbarkStore
  public history: EmbarkHistory

  constructor({ story, initialData = {}, history = [] }: SessionParams) {
    this.story = story
    this._initialData = initialData
    this.history = history
  }

  public get store() {
    return this._initialData
  }

  public pop = () => {
    return this.history.pop()
  }

  public toJSON = () => {
    return {
      story: this.story,
      initialData: this._initialData,
      history: this.history,
    }
  }
}

export const Persistence = {
  save({ req, res, session }: SaveParams) {
    setCookies(COOKIE_KEY, JSON.stringify(session.toJSON()), { req, res, sameSite: 'lax' })
  },

  get({ req, res }: GetParams) {
    const rawSession = getCookie(COOKIE_KEY, { req, res })

    if (typeof rawSession !== 'string') {
      return null
    }

    return Persistence.create(JSON.parse(rawSession))
  },

  create: (params: SessionParams) => new Session(params),
}
