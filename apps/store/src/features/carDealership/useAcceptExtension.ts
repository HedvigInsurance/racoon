import { datadogLogs } from '@datadog/browser-logs'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { dismissedBannerIdAtom } from '@/components/GlobalBanner/globalBannerState'
import { CarDealershipBanners } from '@/features/carDealership/carDearlership.constants'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import {
  MemberPaymentConnectionStatus,
  type ShopSessionFragment,
  useCarDealershipRemoveAddMutation,
  useCurrentMemberLazyQuery,
} from '@/services/graphql/generated'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
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
  const setDismissedBannerId = useSetAtom(dismissedBannerIdAtom)
  const { showError } = useAppErrorHandleContext()
  const [getCurrentMember] = useCurrentMemberLazyQuery()
  const locale = useRoutingLocale()

  useEffect(() => {
    const error = currentOperation?.error
    if (error) {
      showError(new Error(error))
    }
  }, [showError, currentOperation])

  const performSign = () => {
    const { ssn } = params.shopSession.customer ?? {}

    if (!ssn) {
      return LOGGER.info(`Impossible to sign shopSession: ${params.shopSession.id} - lacking 'ssn'`)
    }

    startCheckoutSign({
      shopSessionId: params.shopSession.id,
      ssn,

      async onSuccess() {
        const { data, error } = await getCurrentMember()

        if (!data) {
          showError(error ?? new Error('Failed to fetch current member'))
          return
        }

        setDismissedBannerId(CarDealershipBanners.Extend)

        const nextUrl = PageLink.carDealershipConfirmation({
          locale,
          contractId: params.trialContractId,
        }).pathname

        if (
          data.currentMember.paymentInformation.status === MemberPaymentConnectionStatus.NeedsSetup
        ) {
          LOGGER.info('Member does not have active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
          await router.push(
            PageLink.checkoutPaymentTrustly({
              locale,
              shopSessionId: params.shopSession.id,
              nextUrl,
            }),
          )
        } else {
          LOGGER.info('Member has active payment connection', {
            promptedPayment: params.requirePaymentConnection,
          })
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
