import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Space, Button, RestartIcon, Text, BankIdIcon } from 'ui'
import { InfoCard } from '@/components/InfoCard/InfoCard'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Cart, ShopSessionAuthenticationStatus } from '@/services/apollo/generated'
import { useCurrentMemberLazyQuery } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { ActionButtonsCar } from './ActionButtonsCar'
import { type CarTrialData } from './carDealershipFixtures'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'

const carDealershipLogger = datadogLogs.createLogger('car-dealership')

const SIGN_AND_PAY_BUTTON = 'Sign and pay'
const SIGN_BUTTON = 'Sign insurance'
const CONTINUE_WITHOUT_EXTENSION_BUTTON = 'Connect payment in the app'
const INFO_CARD_CONTENT = 'Se allt om din prova på-försäkring i Hedvig-appen.'
const UNDO_REMOVE_BUTTON = 'Undo removal'

type Props = {
  contract: CarTrialData['trialContract']
  priceIntent: CarTrialData['priceIntent']
  shopSession: CarTrialData['shopSession']
  requirePaymentConnection: boolean
}

export const TrialExtensionForm = (props: Props) => {
  const [userWantsExtension, setUserWantsExtension] = useState(true)
  const { signAndPay, loading } = useSignAndPay({
    shopSessionId: props.shopSession.id,
    ssn: props.shopSession.customer.ssn,
    authenticationStatus: props.shopSession.customer.authenticationStatus,
    cartEntries: props.shopSession.cart.entries,
    requirePaymentConnection: props.requirePaymentConnection,
  })

  const [tierLevel, setTierLevel] = useState<string>(() => {
    return (
      props.priceIntent.defaultOffer?.variant.typeOfContract ??
      props.priceIntent.offers[0].variant.typeOfContract
    )
  })
  const selectedOffer =
    props.priceIntent.offers.find((item) => item.variant.typeOfContract === tierLevel) ??
    props.priceIntent.defaultOffer ??
    props.priceIntent.offers[0]

  const handleUpdate = (tierLevel: string) => {
    const match = props.priceIntent.offers.find((item) => item.variant.typeOfContract === tierLevel)
    if (!match) {
      throw new Error(`Unable to find offer with tierLevel ${tierLevel}`)
    }

    setTierLevel(tierLevel)
  }

  const handleRemove = () => {
    datadogRum.addAction('Car dealership | Remove')
    setUserWantsExtension(false)
  }

  const handleUndo = () => {
    datadogRum.addAction('Car dealership | Undo remove')
    setUserWantsExtension(true)
  }

  const handleSignAndPay = () => {
    datadogRum.addAction('Car dealership | Sign and pay')
    signAndPay(selectedOffer.id)
  }

  if (!userWantsExtension) {
    return (
      <Space y={2}>
        <Space y={1}>
          <ProductItemContractContainerCar contract={props.contract} />
          <Button variant="secondary" onClick={handleUndo}>
            <SpaceFlex direction="horizontal" space={0.5}>
              <RestartIcon />
              {UNDO_REMOVE_BUTTON}
            </SpaceFlex>
          </Button>
          <Button variant="primary">{CONTINUE_WITHOUT_EXTENSION_BUTTON}</Button>
        </Space>
      </Space>
    )
  }

  return (
    <Space y={2}>
      <Space y={1.5}>
        <Text align="center">{props.contract.exposure.displayNameFull}</Text>
        <ProductItemContractContainerCar contract={props.contract} />

        <Space y={0.75}>
          <ProductItemContainer offer={selectedOffer} defaultExpanded={true}>
            <ActionButtonsCar
              priceIntent={props.priceIntent}
              offer={selectedOffer}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
            />
          </ProductItemContainer>

          <InfoCard>{INFO_CARD_CONTENT}</InfoCard>
        </Space>

        <Button onClick={handleSignAndPay} loading={loading}>
          <SpaceFlex space={0.5} align="center">
            <BankIdIcon />
            {props.requirePaymentConnection ? SIGN_AND_PAY_BUTTON : SIGN_BUTTON}
          </SpaceFlex>
        </Button>
      </Space>
    </Space>
  )
}

type Params = {
  shopSessionId: string
  ssn: string
  authenticationStatus: ShopSessionAuthenticationStatus
  cartEntries: Cart['entries']
  requirePaymentConnection: boolean
}

const useSignAndPay = (params: Params) => {
  const { startCheckoutSign } = useBankIdContext()
  const router = useRouter()
  const { showError } = useAppErrorHandleContext()

  const [getCurrentMember] = useCurrentMemberLazyQuery({
    onCompleted(data) {
      if (data.currentMember.hasActivePaymentConnection) {
        carDealershipLogger.info('Member has active payment connection', {
          promptedPayment: params.requirePaymentConnection,
        })
        router.push(PageLink.confirmation({ shopSessionId: params.shopSessionId }))
      } else {
        carDealershipLogger.info('Member does not have active payment connection', {
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
      carDealershipLogger.info('Offer already added to cart')
      performSign()
    } else {
      carDealershipLogger.info(`Adding offer to cart: ${offerId}`)
      addToCart(offerId)
    }
  }

  return { signAndPay: addAndOrSign, loading: loadingAddToCart } as const
}
