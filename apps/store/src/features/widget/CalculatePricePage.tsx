import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Heading, mq, Space, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { Pillow } from '@/components/Pillow/Pillow'
import {
  useIsPriceCalculatorStateReady,
  useSyncPriceCalculatorState,
} from '@/components/PriceCalculator/priceCalculatorAtoms'
import { PriceCalculatorDynamic } from '@/components/PriceCalculator/PriceCalculatorDynamic'
import { completePriceLoader, PriceLoader } from '@/components/PriceLoader'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import {
  ExternalInsuranceCancellationOption,
  usePriceIntentConfirmMutation,
  type WidgetPriceIntentFragment,
} from '@/services/graphql/generated'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { Header } from './Header'

const CAR_INSURANCE = 'SE_CAR'

type Props = {
  shopSession: ShopSession
  priceIntent: WidgetPriceIntentFragment
  priceTemplate: Template
  flow: string
  showBackButton?: boolean
}

export const CalculatePricePage = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const { showError } = useAppErrorHandleContext()
  const priceLoaderPromise = useRef<Promise<void> | null>(null)

  const locale = useRoutingLocale()
  const router = useRouter()
  const tracking = useTracking()
  const entryToReplace = props.shopSession.cart.entries.find(
    (item) => item.product.name === props.priceIntent.product.name,
  )
  const [addToCart] = useAddToCart({
    shopSessionId: props.shopSession.id,
    entryToReplace: entryToReplace?.id,
    async onError() {
      await priceLoaderPromise.current
      setLoading(false)
    },
    async onSuccess(productOfferId, updatedCart) {
      datadogLogs.logger.debug('Widget | Added to cart')
      tracking.reportViewCart(updatedCart)

      await priceLoaderPromise.current

      const addedOffer = updatedCart.entries.find((item) => item.id === productOfferId)
      // Later that 'insurance base' check will be removed. At first, switching directly to sign page will be available
      // only for car. Other insurances like home sould keep using "switch page"
      const isCarInsurance = addedOffer?.product.name === CAR_INSURANCE
      if (
        !isCarInsurance &&
        addedOffer?.cancellation.option !== ExternalInsuranceCancellationOption.None
      ) {
        await router.push(
          PageLink.widgetSwitch({
            locale,
            flow: props.flow,
            shopSessionId: props.shopSession.id,
            priceIntentId: props.priceIntent.id,
          }),
        )
      } else {
        await router.push(
          PageLink.widgetSign({
            locale,
            flow: props.flow,
            shopSessionId: props.shopSession.id,
            priceIntentId: props.priceIntent.id,
          }),
        )
      }
    },
  })

  const [confirm] = usePriceIntentConfirmMutation({
    variables: { priceIntentId: props.priceIntent.id },
    async onError(error) {
      await priceLoaderPromise.current
      showError(error)
      setLoading(false)
    },
    onCompleted(data) {
      const productOfferId = data.priceIntentConfirm.priceIntent?.defaultOffer?.id
      if (!productOfferId) throw new Error('Missing default offer')
      datadogLogs.logger.debug('Widget | Adding to cart', {
        productOfferId,
        isReplacingEntry: !!entryToReplace,
      })
      addToCart(productOfferId)
    },
  })

  const handleConfirm = () => {
    datadogRum.addAction('Widget Confirm Price', {
      shopSessionId: props.shopSession.id,
      flow: props.flow,
      productName: props.priceIntent.product.name,
    })
    setLoading(true)
    confirm()
    priceLoaderPromise.current = completePriceLoader()
  }

  useSyncPriceTemplate(props.priceTemplate)
  useSyncPriceCalculatorState(props.priceIntent)

  const shopSessionId = useShopSessionId()
  const isReady = useIsPriceCalculatorStateReady()
  if (shopSessionId == null || !isReady) {
    return null
  }

  return (
    <Wrapper y={3}>
      <Header step="YOUR_INFO" showBackButton={props.showBackButton} />

      <Space y={2.5}>
        <SpaceFlex align="center" direction="vertical">
          <Pillow size="xlarge" {...props.priceIntent.product.pillowImage} />
          <Heading as="h2" variant="standard.18" align="center">
            {props.priceIntent.product.displayNameShort}
          </Heading>
        </SpaceFlex>

        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <PriceCalculatorDynamic onConfirm={handleConfirm} />
          </GridLayout.Content>
        </GridLayout.Root>
      </Space>

      <FullscreenDialog.Root open={loading}>
        <FullscreenDialog.Modal center={true} Header={null}>
          <PriceLoaderWrapper>
            <PriceLoader />
          </PriceLoaderWrapper>
        </FullscreenDialog.Modal>
      </FullscreenDialog.Root>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingBottom: theme.space.lg,
  [mq.lg]: { paddingBottom: theme.space.xxl },
})

const PriceLoaderWrapper = styled.div({
  width: '22rem',
  maxWidth: '100%',
})
