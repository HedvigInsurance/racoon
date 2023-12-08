import { datadogLogs } from '@datadog/browser-logs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import {
  MemberPaymentConnectionStatus,
  type ShopSessionFragment,
  useCarDealershipRemoveAddMutation,
  useCurrentMemberLazyQuery,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'

const LOGGER = datadogLogs.createLogger('car-dealership')

type Params = {
  shopSession: ShopSessionFragment
  trialContractId: string
  requirePaymentConnection: boolean
}

export const useAcceptExtension = (params: Params) => {
  const { startCheckoutSign, currentOperation } = useBankIdContext()
  const router = useRouter()
  const { dismissBanner } = useGlobalBanner()
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

        const nextUrl = PageLink.carDealershipConfirmation({
          contractId: params.trialContractId,
        }).pathname

        if (
          data.currentMember.paymentInformation.status === MemberPaymentConnectionStatus.NeedsSetup
        ) {
          LOGGER.info('Member does not have active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
          dismissBanner()
          await router.push(
            PageLink.checkoutPaymentTrustly({ shopSessionId: params.shopSession.id, nextUrl }),
          )
        } else {
          LOGGER.info('Member has active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
          dismissBanner()
          await router.push(nextUrl)
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

  let signLoading = false
  const { state: bankIdState } = currentOperation ?? {}
  if (bankIdState) {
    signLoading = [BankIdState.Starting, BankIdState.Pending, BankIdState.Success].includes(
      bankIdState,
    )
  }
  const loading = loadingRemoveAdd || signLoading

  return [addExtensionOffer, loading] as const
}
