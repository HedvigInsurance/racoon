import { datadogLogs } from '@datadog/browser-logs'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useTracking } from '@/services/Tracking/useTracking'

type InsurelyState = 'INITIAL' | 'PROMPT' | 'COMPARE' | 'SUCCESS' | 'DISMISSED'

const insurelyStateAtom = atom<InsurelyState>('INITIAL')

type Params = {
  priceIntentId: string
}

export const useFetchInsuranceState = () => {
  return useAtom(insurelyStateAtom)
}

export const useShowFetchInsurance = ({ priceIntentId }: Params) => {
  const setState = useSetAtom(insurelyStateAtom)
  const tracking = useTracking()

  return useCallback(
    ({ force = false }: { force?: boolean } = {}) => {
      const sessionStorageKey = `hedvig.fetchInsurance.${priceIntentId}.shown`
      const hasShown = window.sessionStorage.getItem(sessionStorageKey) === 'true'

      setState((currentState) => {
        if (force || (!hasShown && currentState === 'INITIAL')) {
          window.sessionStorage.setItem(sessionStorageKey, 'true')

          datadogLogs.logger.info('Display FetchInsurancePrompt', { priceIntentId })
          tracking.reportInsurelyPrompted()

          return 'PROMPT'
        }

        return currentState
      })
    },
    [setState, priceIntentId, tracking],
  )
}

export const useFetchInsuranceCompare = () => {
  const setState = useSetAtom(insurelyStateAtom)
  const tracking = useTracking()

  return useCallback(() => {
    tracking.reportInsurelyAccepted()

    setState('COMPARE')
  }, [setState, tracking])
}

export const useFetchInsuranceSuccess = () => {
  const setState = useSetAtom(insurelyStateAtom)
  const tracking = useTracking()

  return useCallback(() => {
    tracking.reportInsurelyCorrectlyFetched()

    setState('SUCCESS')
  }, [setState, tracking])
}
