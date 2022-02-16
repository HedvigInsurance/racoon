import { Embark, EmbarkHistory, JSONStory } from 'embark-core'
import type { IncomingMessage, ServerResponse } from 'http'
import { getCookie, removeCookies, setCookies } from 'cookies-next'

import fs from 'fs/promises'
import path from 'path'

const COOKIE_KEY = '_HEDVIG_EMBARK_HISTORY'
const EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER = 'embark'

export const fetchEmbarkStory = async (storyName: string): Promise<JSONStory> => {
  const dir = path.resolve('./public', EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER)
  const storyPath = path.join(dir, `${storyName}.json`)
  const story = await fs.readFile(storyPath, 'utf8')
  return JSON.parse(story)
}

const isEmbarkHistory = (history: unknown): history is EmbarkHistory => {
  return Array.isArray(history)
}

export const getEmbarkHistory = (req: IncomingMessage, res: ServerResponse): EmbarkHistory => {
  const rawEmbarkHistory = getCookie(COOKIE_KEY, { req, res })
  if (typeof rawEmbarkHistory === 'string') {
    const embarkHistory = JSON.parse(rawEmbarkHistory)
    if (isEmbarkHistory(embarkHistory)) return embarkHistory
  }
  return []
}

export const updateEmbarkHistory = (req: IncomingMessage, res: ServerResponse, history: any) => {
  setCookies(COOKIE_KEY, JSON.stringify(history), { req, res })
}

export const clearEmbarkHistory = (req: IncomingMessage, res: ServerResponse) => {
  removeCookies(COOKIE_KEY, { req, res })
}

type GetNextEmbarkPassageParams = {
  storyName: string
  req: IncomingMessage
  res: ServerResponse
}

export const getNextEmbarkPassage = async ({ storyName, req, res }: GetNextEmbarkPassageParams) => {
  const history = getEmbarkHistory(req, res)
  const story = await fetchEmbarkStory(storyName)
  return Embark.fetchPassage({ story, history })
}
