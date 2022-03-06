import { Passage, PassageElement, PassageRedirect, Redirect } from '@/shared/types'

import { JSONStory } from '@/angel/types'
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

const isRedirect = (redirect: PassageRedirect): redirect is Redirect => {
  return redirect.type === PassageElement.Redirect
}

export const followRedirects = ({
  story,
  store,
  passage,
  storeDiff = {},
}: FollowRedirectsParams): Store => {
  const redirectLink = getRedirectLink(store, passage.redirects)
  let passageName =
    redirectLink?.type === PassageElement.Redirect ? redirectLink.link.to : undefined

  if (!passageName) return storeDiff

  const passageOrUndefined = angel.getPassageByName(story, passageName)
  invariant(passageOrUndefined !== undefined, 'Could not determine next passage')
  const nextPassage = angel.parsePassage(passageOrUndefined)

  const redirect = passage.redirects.filter(isRedirect).find((item) => item.link.to === passageName)

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
