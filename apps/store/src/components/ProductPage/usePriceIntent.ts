import { datadogLogs } from '@datadog/browser-logs'
import { useCallback, useEffect, useMemo } from 'react'
import {
  usePriceIntentCreateMutation,
  usePriceIntentDataUpdateMutation,
  usePriceIntentQuery,
} from '@/services/apollo/generated'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { getStoredPriceIntentId, savePriceIntent } from '@/services/priceIntent/PriceIntent.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

type Params = {
  shopSession?: ShopSession
  priceTemplate: Template
  productName: string
}

export const usePriceIntent = ({ shopSession, priceTemplate, productName }: Params) => {
  const storedPriceIntentId = shopSession && getStoredPriceIntentId({ shopSession, priceTemplate })

  const [updatePriceIntentData] = usePriceIntentDataUpdateMutation({
    onError(error) {
      datadogLogs.logger.error('Failed to update PriceIntent with initial data', { error })
    },
  })

  const variables = useMemo(
    () => (shopSession ? { shopSessionId: shopSession.id, productName } : null),
    [shopSession, productName],
  )

  const [createPriceIntent, createResult] = usePriceIntentCreateMutation({
    onCompleted: ({ priceIntentCreate }) => {
      if (shopSession) {
        savePriceIntent({ shopSession, priceTemplate, priceIntent: priceIntentCreate })
      } else {
        datadogLogs.logger.error('ShopSession missing when saving price intent', {
          priceIntentId: priceIntentCreate.id,
        })
      }

      if (priceTemplate.initialData) {
        updatePriceIntentData({
          variables: {
            priceIntentId: priceIntentCreate.id,
            data: priceTemplate.initialData,
          },
        })
      }
    },
    onError(error) {
      datadogLogs.logger.error('Failed to create PriceIntent', { ...variables, error })
    },
  })

  const createNewPriceIntent = useCallback(() => {
    if (storedPriceIntentId) return
    if (createResult.loading) return
    if (createResult.error) return
    if (!variables) {
      datadogLogs.logger.error('ShopSession missing when creating price intent (createNew)')
      return
    }

    createPriceIntent({ variables })
  }, [storedPriceIntentId, createResult, variables, createPriceIntent])

  const result = usePriceIntentQuery({
    skip: !storedPriceIntentId,
    variables: storedPriceIntentId ? { priceIntentId: storedPriceIntentId } : undefined,
    ssr: typeof window === 'undefined',
    onError: (error) => {
      datadogLogs.logger.warn('PriceIntent not found', {
        priceIntentId: storedPriceIntentId,
        error,
      })
      createNewPriceIntent()
    },
  })

  // @TODO: make sure this doesn't run more than once
  useEffect(createNewPriceIntent, [createNewPriceIntent])

  return result
}
