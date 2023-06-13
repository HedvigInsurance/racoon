import { atom, useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'

type State = 'INITIAL' | 'PROMPT' | 'COMPARE' | 'SUCCESS' | 'DISMISSED'

const STATE_ATOM = atom<State>('INITIAL')

type Params = {
  priceIntentId: string
}

export const useFetchInsuranceState = () => {
  return useAtom(STATE_ATOM)
}

export const useShowFetchInsurance = ({ priceIntentId }: Params) => {
  const setState = useSetAtom(STATE_ATOM)

  return useCallback(
    ({ force = false }: { force?: boolean } = {}) => {
      const sessionStorageKey = `hedvig.fetchInsurance.${priceIntentId}.shown`
      const hasShown = window.sessionStorage.getItem(sessionStorageKey) === 'true'

      setState((currentState) => {
        if (force || (!hasShown && currentState === 'INITIAL')) {
          window.sessionStorage.setItem(sessionStorageKey, 'true')
          return 'PROMPT'
        }

        return currentState
      })
    },
    [setState, priceIntentId],
  )
}
