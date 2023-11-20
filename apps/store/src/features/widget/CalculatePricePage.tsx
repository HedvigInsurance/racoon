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
import {
  usePriceIntentConfirmMutation,
  type WidgetPriceIntentFragment,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { EXTERNAL_INSURANCE_FIELD_NAME } from '@/services/PriceCalculator/formFragments'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { Header } from './Header'

type Props = {
  shopSession: ShopSession
  priceIntent: WidgetPriceIntentFragment
  priceTemplate: Template
  flow: string
  compareInsurance: boolean
}

export const CalculatePricePage = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const { showError } = useAppErrorHandleContext()
  const priceLoaderPromise = useRef<Promise<void> | null>(null)

  const router = useRouter()
  const [addToCart] = useAddToCart({
    shopSessionId: props.shopSession.id,
    async onError() {
      await priceLoaderPromise.current
      setLoading(false)
    },
    async onSuccess() {
      await priceLoaderPromise.current
      await router.push(
        PageLink.widgetSign({
          flow: props.flow,
          shopSessionId: props.shopSession.id,
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
      addToCart(productOfferId)
    },
  })

  const handleConfirm = () => {
    setLoading(true)
    confirm()
    priceLoaderPromise.current = completePriceLoader()
  }

  return (
    <Wrapper y={3}>
      <Header step="YOUR_INFO" />

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
              hideFields={props.compareInsurance ? undefined : [EXTERNAL_INSURANCE_FIELD_NAME]}
            />
          </GridLayout.Content>
        </GridLayout.Root>
      </Space>

      <FullscreenDialog.Root open={loading}>
        <FullscreenDialog.Modal center={true}>
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
