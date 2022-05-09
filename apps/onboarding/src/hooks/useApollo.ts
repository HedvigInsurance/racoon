import { useMemo } from 'react'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo'

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
