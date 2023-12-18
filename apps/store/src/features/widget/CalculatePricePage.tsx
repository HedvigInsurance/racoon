import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { Space, Heading, mq, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PriceLoader, completePriceLoader } from '@/components/PriceLoader'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import {
  usePriceIntentConfirmMutation,
  type WidgetPriceIntentFragment,
} from '@/services/graphql/generated'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { Header } from './Header'

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
    async onSuccess(_, updatedCart) {
      datadogLogs.logger.debug('Widget | Added to cart')
      tracking.reportViewCart(updatedCart)
      await priceLoaderPromise.current
      await router.push(
        PageLink.widgetSign({
          flow: props.flow,
          shopSessionId: props.shopSession.id,
          priceIntentId: props.priceIntent.id,
        }),
      )
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
            <PriceCalculator
              shopSession={props.shopSession}
              priceIntent={props.priceIntent}
              priceTemplate={props.priceTemplate}
              onConfirm={handleConfirm}
            />
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
