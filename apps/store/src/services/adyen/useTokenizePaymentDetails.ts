import { useCallback } from 'react'
import {
  type BrowserInfo,
  TokenizationChannel,
  useAdyenTokenizePaymentDetailsMutation,
} from '@/services/apollo/generated'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

export const useTokenizePaymentDetails = () => {
  const { routingLocale } = useCurrentLocale()
  const [tokenizePaymentDetails] = useAdyenTokenizePaymentDetailsMutation()

  return useCallback(
    async (browserInfo: BrowserInfo, paymentMethod: string) => {
      const result = await tokenizePaymentDetails({
        variables: {
          paymentsRequest: {
            browserInfo,
            paymentMethodDetails: JSON.stringify(paymentMethod),
            channel: TokenizationChannel.Web,
            returnUrl: PageLink.apiAdyenCallback({ locale: routingLocale }).href,
          },
        },
      })

      const response = result.data?.tokenizePaymentDetails2

      if (!response) {
        throw new Error('Failed to tokenize payment details')
      }

      return response
    },
    [tokenizePaymentDetails, routingLocale],
  )
}
