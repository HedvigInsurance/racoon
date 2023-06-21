import { datadogLogs } from '@datadog/browser-logs'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { useTracking } from '@/services/Tracking/useTracking'

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
  const tracking = useTracking()
  const { productData } = useProductPageContext()

  return useCallback(
    ({ force = false }: { force?: boolean } = {}) => {
      const sessionStorageKey = `hedvig.fetchInsurance.${priceIntentId}.shown`
      const hasShown = window.sessionStorage.getItem(sessionStorageKey) === 'true'

      setState((currentState) => {
        if (force || (!hasShown && currentState === 'INITIAL')) {
          window.sessionStorage.setItem(sessionStorageKey, 'true')

          datadogLogs.logger.info('Display FetchInsurancePrompt', { priceIntentId })
          tracking.reportInsurelyPrompted({
            id: productData.id,
            displayNameFull: productData.displayNameFull,
          })

          return 'PROMPT'
        }

        return currentState
      })
    },
    [setState, priceIntentId, tracking, productData],
  )
}

export const useFetchInsuranceCompare = () => {
  const setState = useSetAtom(STATE_ATOM)
  const tracking = useTracking()
  const { productData } = useProductPageContext()

  return useCallback(() => {
    tracking.reportInsurelyAccepted({
      id: productData.id,
      displayNameFull: productData.displayNameFull,
    })

    setState('COMPARE')
  }, [setState, tracking, productData])
}

export const useFetchInsuranceSuccess = () => {
  const setState = useSetAtom(STATE_ATOM)
  const tracking = useTracking()
  const { productData } = useProductPageContext()

  return useCallback(() => {
    tracking.reportInsurelyCorrectlyFetched({
      id: productData.id,
      displayNameFull: productData.displayNameFull,
    })

    setState('SUCCESS')
  }, [setState, tracking, productData])
}
