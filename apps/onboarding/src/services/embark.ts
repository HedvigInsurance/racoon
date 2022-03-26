import fs from 'fs/promises'
import type { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { getCookie, removeCookies, setCookies } from 'cookies-next'
import {
  ClientGraphQLAction,
  Embark as EmbarkCore,
  EmbarkHistory,
  EmbarkPassage,
  JSONStory,
} from 'embark-core'
import gql from 'graphql-tag'

export namespace Embark {
  const COOKIE_KEY = '_HEDVIG_EMBARK_HISTORY'
  const EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER = 'embark'

  export const story = async (storyName: string): Promise<JSONStory> => {
    const dir = path.resolve('./public', EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER)
    const storyPath = path.join(dir, `${storyName}.json`)
    const story = await fs.readFile(storyPath, 'utf8')
    return JSON.parse(story)
  }

  export const passage = EmbarkCore.getPassage
  export const submit = EmbarkCore.submitUserInput

  const isEmbarkHistory = (history: unknown): history is EmbarkHistory => {
    return Array.isArray(history)
  }

  export const history = (req: IncomingMessage, res: ServerResponse): EmbarkHistory => {
    const rawEmbarkHistory = getCookie(COOKIE_KEY, { req, res })
    if (typeof rawEmbarkHistory === 'string') {
      const embarkHistory = JSON.parse(rawEmbarkHistory)
      if (isEmbarkHistory(embarkHistory)) return embarkHistory
    }
    return []
  }

  export const save = (req: IncomingMessage, res: ServerResponse, history: EmbarkHistory) => {
    setCookies(COOKIE_KEY, JSON.stringify(history), { req, res, sameSite: 'lax' })
  }

  export const clear = (req: IncomingMessage, res: ServerResponse) => {
    removeCookies(COOKIE_KEY, { req, res })
  }

  type NextPassageParams = {
    storyName: string
    req: IncomingMessage
    res: ServerResponse
  }

  export const nextPassage = async ({ storyName, req, res }: NextPassageParams) => {
    const history = Embark.history(req, res)
    const story = await Embark.story(storyName)
    return EmbarkCore.fetchPassage({ story, history })
  }

  type RunMutationParams = {
    client: ApolloClient<NormalizedCacheObject>
    story: JSONStory
    action: ClientGraphQLAction
    history: EmbarkHistory
    passage: EmbarkPassage
  }

  export const runMutation = async ({
    client,
    action,
    story,
    passage,
    history,
  }: RunMutationParams) => {
    try {
      const variables = EmbarkCore.evaluateVariables({
        story,
        history,
        variables: action.variables,
      })
      console.log(action.document)
      console.log(JSON.stringify(variables, null, 2))

      const response = await client.mutate({
        mutation: gql(action.document),
        variables,
      })

      console.log(JSON.stringify(response, null, 2))
      return EmbarkCore.submitPassage({ story, history, passage })
    } catch (error) {
      throw error
    }
  }
}
