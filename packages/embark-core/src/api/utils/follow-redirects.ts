import { JSONStory } from '@/angel/types'
import { Passage } from '@/shared/types'
import { Store } from '../types'
import { angel } from '@/angel/index'
import { getRedirectLink } from './get-redirect-link'
import invariant from 'tiny-invariant'
import { parseRedirectInput } from './parse-redirect-input'

type FollowRedirectsParams = {
  story: JSONStory
  store: Store
  passage: Passage
  storeDiff?: Store
}

export const followRedirects = ({
  story,
  store,
  passage,
  storeDiff = {},
}: FollowRedirectsParams): Store => {
  let passageName = getRedirectLink(store, passage.redirects)

  if (!passageName) return storeDiff

  const passageOrUndefined = angel.getPassageByName(story, passageName)
  invariant(passageOrUndefined !== undefined, 'Could not determine next passage')
  const nextPassage = angel.parsePassage(passageOrUndefined)

  const redirect = passage.redirects.find((redirect) => redirect.link.to === passageName)
  return followRedirects({
    story,
    store,
    passage: nextPassage,
    storeDiff: {
      ...storeDiff,
      ...(redirect ? parseRedirectInput(redirect) : {}),
    },
  })
}
