import { Space, Heading } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Pillow } from '@/components/Pillow/Pillow'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type WidgetPriceIntentFragment } from '@/services/apollo/generated'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { Header } from './Header'

type Props = {
  shopSession: ShopSession
  priceIntent: WidgetPriceIntentFragment
  priceTemplate: Template
  flow: string
}

export const CalculatePricePage = (props: Props) => {
  const handleConfirm = () => {
    console.debug('Confirm')
  }

  return (
    <Space y={3}>
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
            />
          </GridLayout.Content>
        </GridLayout.Root>
      </Space>
    </Space>
  )
}
