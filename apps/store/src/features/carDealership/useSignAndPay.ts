import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import {
  Cart,
  ShopSessionAuthenticationStatus,
  useCurrentMemberLazyQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'

const LOGGER = datadogLogs.createLogger('car-dealership')

type Params = {
  shopSessionId: string
  ssn: string
  authenticationStatus: ShopSessionAuthenticationStatus
  cartEntries: Cart['entries']
  requirePaymentConnection: boolean
}

export const useSignAndPay = (params: Params) => {
  const { startCheckoutSign } = useBankIdContext()
  const router = useRouter()
  const { showError } = useAppErrorHandleContext()

  const [getCurrentMember] = useCurrentMemberLazyQuery({
    onCompleted(data) {
      if (data.currentMember.hasActivePaymentConnection) {
        LOGGER.info('Member has active payment connection', {
          promptedPayment: params.requirePaymentConnection,
        })
        router.push(PageLink.confirmation({ shopSessionId: params.shopSessionId }))
      } else {
        LOGGER.info('Member does not have active payment connection', {
          promptedPayment: params.requirePaymentConnection,
        })
        router.push(PageLink.checkoutPaymentTrustly({ shopSessionId: params.shopSessionId }))
      }
    },
  })

  const performSign = () => {
    startCheckoutSign({
      shopSessionId: params.shopSessionId,
      ssn: params.ssn,
      customerAuthenticationStatus: params.authenticationStatus,

      onSuccess() {
        console.info('Successfully signed shop session')
        getCurrentMember()
      },
    })
  }

  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId: params.shopSessionId,
    onSuccess(productOfferId) {
      console.info('Successfully added product to cart', productOfferId)
      performSign()
    },
  })

  const addAndOrSign = (offerId: string) => {
    if (params.cartEntries.length > 1) {
      showError(
        new Error(
          `Cart has unexpected items in it. cartOfferIds=${params.cartEntries.map(
            ({ id }) => id,
          )}. Offer to be added: ${offerId}`,
        ),
      )
      return
    }

    const alreadyAdded = params.cartEntries.some((entry) => entry.id === offerId)
    if (alreadyAdded) {
      LOGGER.info('Offer already added to cart')
      performSign()
    } else {
      LOGGER.info(`Adding offer to cart: ${offerId}`)
      addToCart(offerId)
    }
  }

  return { signAndPay: addAndOrSign, loading: loadingAddToCart } as const
}
