import fs from 'fs/promises'
import path from 'path'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  ClientGraphQLAction,
  Embark as EmbarkCore,
  EmbarkHistory,
  EmbarkPassage,
  JSONStory,
} from 'embark-core'
import gql from 'graphql-tag'

export { Persistence } from './persistence'

const EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER = 'embark'

export const story = async (storyName: string): Promise<JSONStory> => {
  const dir = path.resolve('./public', EMBARK_DIR_RELATIVE_TO_PUBLIC_FOLDER)
  const storyPath = path.join(dir, `${storyName}.json`)
  const story = await fs.readFile(storyPath, 'utf8')
  return JSON.parse(story)
}

export const passage = EmbarkCore.getPassage
export const submit = EmbarkCore.submitUserInput

type NextPassageParams = {
  storyName: string
  history: EmbarkHistory
}

export const nextPassage = async ({ storyName, history }: NextPassageParams) => {
  const embarkStory = await story(storyName)
  return EmbarkCore.fetchPassage({ story: embarkStory, history })
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
