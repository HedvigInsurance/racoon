import { useEffect } from 'react'
import { usePriceIntentLazyQuery } from '@/services/apollo/generated'
import { Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntentService } from '@/services/priceIntent/PriceIntentService'

type Params = {
  priceIntentService?: PriceIntentService
  priceTemplate: Template
  productName: string
}

export const usePriceIntent = ({ priceIntentService, priceTemplate, productName }: Params) => {
  const [fetchQuery, queryResult] = usePriceIntentLazyQuery({
    // Prevent network requests and ensure we trigger an error on cache miss, which should never happen
    fetchPolicy: 'cache-only',
  })

  console.log('upi', queryResult.called)

  useEffect(() => {
    priceIntentService?.fetch({ priceTemplate, productName }).then((priceIntent) =>
      fetchQuery({
        variables: { priceIntentId: priceIntent.id },
      }),
    )
  }, [fetchQuery, priceIntentService, priceTemplate, productName])

  return queryResult
}
