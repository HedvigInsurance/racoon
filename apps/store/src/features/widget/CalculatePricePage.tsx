import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useRef, useState } from 'react'
import { FullscreenDialog, Heading, mq, Space, theme, visuallyHidden } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculatorDynamic } from '@/components/PriceCalculator/PriceCalculatorDynamic'
import { completePriceLoader, PriceLoader } from '@/components/PriceLoader'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import {
  useIsPriceIntentStateReady,
  useSyncPriceIntentState,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import { usePriceIntentConfirmMutation } from '@/services/graphql/generated'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { Header } from './Header'

type Props = {
  priceIntentId: string
  priceTemplate: Template
  flow: string
  showBackButton?: boolean
}

export const CalculatePricePage = (props: Props) => {
  const { t } = useTranslation('purchase-form')
  const [loading, setLoading] = useState(false)
  const showError = useShowAppError()
  const priceLoaderPromise = useRef<Promise<void> | null>(null)

  const locale = useRoutingLocale()
  const router = useRouter()
  const tracking = useTracking()
  const productData = useProductData()
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    throw new Error('shopSession must be defined')
  }
  const shopSessionId = shopSession.id

  const { priceIntentId } = props
  const entryToReplace = shopSession.cart.entries.find(
    (item) => item.product.name === productData.name,
  )
  const [addToCart] = useAddToCart({
    shopSessionId,
    entryToReplace: entryToReplace?.id,
    async onError() {
      await priceLoaderPromise.current
      setLoading(false)
    },
    async onSuccess(productOfferId, updatedCart) {
      datadogLogs.logger.debug('Widget | Added to cart')
      tracking.reportViewCart(updatedCart)

      await priceLoaderPromise.current

      await router.push(
        PageLink.widgetSign({
          locale,
          flow: props.flow,
          shopSessionId,
          priceIntentId,
        }),
      )
    },
  })

  const [confirm] = usePriceIntentConfirmMutation({
    variables: { priceIntentId },
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
      shopSessionId,
      flow: props.flow,
      productName: productData.name,
    })
    setLoading(true)
    confirm()
    priceLoaderPromise.current = completePriceLoader()
  }

  useSyncPriceTemplate(props.priceTemplate)
  useSyncPriceIntentState({ preloadedPriceIntentId: priceIntentId })

  const isReady = useIsPriceIntentStateReady()
  if (!isReady) {
    return null
  }

  return (
    <Wrapper y={3}>
      <Header step="YOUR_INFO" showBackButton={props.showBackButton} />

      <Space y={2.5}>
        <SpaceFlex align="center" direction="vertical">
          <Pillow size="xlarge" {...productData.pillowImage} />
          <Heading as="h2" variant="standard.18" align="center">
            {productData.displayNameShort}
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
          <FullscreenDialog.Title className={visuallyHidden}>
            {t('LOADING_PRICE_ANIMATION_LABEL')}
          </FullscreenDialog.Title>
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
