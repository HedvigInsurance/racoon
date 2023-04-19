import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { fetchPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
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
  const { showError } = useAppErrorHandleContext()

  const editProductOffer = async (params: Params) => {
    setState('loading')
    // TODO: Check if product offer is connected to price intent -- if not, create new one

    const product = products?.find((item) => item.name === params.productName)
    if (!product) throw new Error('Product not found')

    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)
    const priceTemplate = fetchPriceTemplate(params.productName)
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
