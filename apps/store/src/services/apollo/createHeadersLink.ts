import { type ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { isBrowser } from '@/utils/env'
import { getShopSessionHeader, performTokenRefreshIfNeeded } from './apollo.helpers'

export const createHeadersLink = (defaultHeaders?: Record<string, string>): ApolloLink => {
  return setContext(async (_, prevContext) => {
    const headers = { ...defaultHeaders }
    if (isBrowser()) {
      Object.assign(headers, {
        ...(await performTokenRefreshIfNeeded()),
        ...getShopSessionHeader(),
      })
    }
    return { headers, ...prevContext }
  })
}
