import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useCurrentMemberLazyQuery } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { type TrialExtension } from './carDealershipFixtures'

const LOGGER = datadogLogs.createLogger('car-dealership')

type Params = {
  shopSession: TrialExtension['shopSession']
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
        router.push(PageLink.confirmation({ shopSessionId: params.shopSession.id }))
      } else {
        LOGGER.info('Member does not have active payment connection', {
          promptedPayment: params.requirePaymentConnection,
        })
        router.push(PageLink.checkoutPaymentTrustly({ shopSessionId: params.shopSession.id }))
      }
    },
  })

  const performSign = () => {
    const { ssn, authenticationStatus } = params.shopSession.customer ?? {}

    if (!ssn || !authenticationStatus) {
      return LOGGER.info(
        `Impossible to sign shopSession: ${params.shopSession.id} - lacking 'ssn' and 'authenticationStatus'`,
      )
    }

    startCheckoutSign({
      shopSessionId: params.shopSession.id,
      customerAuthenticationStatus: authenticationStatus,
      ssn,

      onSuccess() {
        console.info('Successfully signed shop session')
        getCurrentMember()
      },
    })
  }

  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId: params.shopSession.id,
    onSuccess(productOfferId) {
      console.info('Successfully added product to cart', productOfferId)
      performSign()
    },
  })

  const addAndOrSign = (offerId: string) => {
    const cartEntries = params.shopSession.cart.entries
    if (cartEntries.length > 1) {
      showError(
        new Error(
          `Cart has unexpected items in it. cartOfferIds=${cartEntries.map(
            ({ id }) => id,
          )}. Offer to be added: ${offerId}`,
        ),
      )
      return
    }

    const alreadyAdded = cartEntries.some((entry) => entry.id === offerId)
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
