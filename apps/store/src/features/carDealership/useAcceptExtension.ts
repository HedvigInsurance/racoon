import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  useCarDealershipRemoveAddMutation,
  useCurrentMemberLazyQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'
import { type TrialExtension } from './carDealershipFixtures'

const LOGGER = datadogLogs.createLogger('car-dealership')

type Params = {
  shopSession: TrialExtension['shopSession']
  requirePaymentConnection: boolean
}

export const useAcceptExtension = (params: Params) => {
  const { startCheckoutSign, currentOperation } = useBankIdContext()
  const router = useRouter()
  const { showError } = useAppErrorHandleContext()
  const [getCurrentMember] = useCurrentMemberLazyQuery()

  useEffect(() => {
    const error = currentOperation?.error
    if (error instanceof Error) {
      showError(error)
    }
  }, [showError, currentOperation])

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

      async onSuccess() {
        const { data, error } = await getCurrentMember()

        if (!data) {
          showError(error ?? new Error('Failed to fetch current member'))
          return
        }

        if (data.currentMember.hasActivePaymentConnection) {
          LOGGER.info('Member has active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
          await router.push(
            PageLink.confirmation({ shopSessionId: params.shopSession.id }).pathname,
          )
        } else {
          LOGGER.info('Member does not have active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
          await router.push(
            PageLink.checkoutPaymentTrustly({ shopSessionId: params.shopSession.id }).pathname,
          )
        }
      },
    })
  }

  const [cartRemoveAdd, { loading: loadingRemoveAdd }] = useCarDealershipRemoveAddMutation({
    onCompleted() {
      LOGGER.info('Offer already added to cart')
      performSign()
    },
    onError: showError,
  })

  const addExtensionOffer = (offerId: string) => {
    const cartOfferIds = params.shopSession.cart.entries.map((item) => item.id)
    const removeOfferIds = cartOfferIds.filter((id) => id !== offerId)
    const addOfferIds = cartOfferIds.includes(offerId) ? [] : [offerId]

    if (removeOfferIds.length > 0) {
      LOGGER.info('Removing offers from cart', { offers: removeOfferIds })
    }

    if (addOfferIds.length > 0) {
      LOGGER.info('Adding offers to cart', { offers: addOfferIds })
    }

    cartRemoveAdd({
      variables: {
        shopSessionId: params.shopSession.id,
        removeOfferIds,
        addOfferIds,
      },
    })
  }

  return [addExtensionOffer, loadingRemoveAdd] as const
}
