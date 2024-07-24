import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { PRELOADED_PRICE_INTENT_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'

type State = 'idle' | 'loading' | 'error'

type Params = {
  shopSessionId: string
  offerId: string
  data: any
  productName: string
}

export const useEditProductOffer = () => {
  const [state, setState] = useState<State>('idle')
  const apolloClient = useApolloClient()
  const products = useProductMetadata()
  const router = useRouter()
  const showError = useShowAppError()

  const editProductOffer = async (params: Params) => {
    setState('loading')
    // TODO: Check if product offer is connected to price intent -- if not, create new one

    const product = products?.find((item) => item.name === params.productName)
    if (!product) {
      datadogLogs.logger.error('Edit Offer | Product not found', {
        productName: params.productName,
        productNames: products?.map((item) => item.name),
        offerId: params.offerId,
      })
      throw new Error(`Edit Offer | Product not found: ${params.productName}`)
    }

    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)
    const priceTemplate = getPriceTemplate(params.productName)
    if (!priceTemplate) {
      setState('error')
      datadogLogs.logger.error('Price template not found', { productName: params.productName })
      return
    }

    try {
      const priceIntent = await priceIntentService.create({
        shopSessionId: params.shopSessionId,
        productName: params.productName,
        priceTemplate,
      })
      await priceIntentService.update({
        priceIntentId: priceIntent.id,
        data: params.data,
        customer: { shopSessionId: params.shopSessionId },
      })

      await router.push({
        pathname: product.pageLink,
        query: {
          [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: 1,
          replace: params.offerId,
          [PRELOADED_PRICE_INTENT_QUERY_PARAM]: priceIntent.id,
        },
      })
      setState('idle')
    } catch (error) {
      setState('error')
      datadogLogs.logger.error('Error while editing product offer', {
        error,
        offerId: params.offerId,
      })
      showError(error as Error)
    }
  }

  return [editProductOffer, state] as const
}
