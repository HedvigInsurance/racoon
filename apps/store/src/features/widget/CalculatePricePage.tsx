import { Space, Heading } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type WidgetPriceIntentFragment } from '@/services/apollo/generated'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'
import { Header } from './Header'

type Props = {
  priceIntent: WidgetPriceIntentFragment
  priceTemplate: Template
  flow: string
  shopSessionId: string
  priceIntentId: string
}

export const CalculatePricePage = ({ priceIntent }: Props) => {
  return (
    <Space y={3}>
      <Header step="YOUR_INFO" />

      <Space y={2.5}>
        <SpaceFlex align="center" direction="vertical">
          <Pillow size="xlarge" {...priceIntent.product.pillowImage} />
          <Heading as="h2" variant="standard.18" align="center">
            {priceIntent.product.displayNameShort}
          </Heading>
        </SpaceFlex>

        {/* // TODO: add PriceCalculator here */}
      </Space>
    </Space>
  )
}
