import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { PriceCalculator } from '../PriceCalculator/PriceCalculator'
import { PriceCard } from '../PriceCard/PriceCard'
import { TestPricePageProps } from './TestPricePage.types'

const Section = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

export const TestPricePage = ({ template, intent, onSubmit, onReset }: TestPricePageProps) => {
  return (
    <>
      <Space y={3}>
        <PriceCalculator template={template} onSubmit={onSubmit} />

        <Section>
          <PriceCard
            name="Hedvig Home"
            cost={intent.product?.price}
            currency="SEK"
            gradient={['#aaa', '#fff']}
            onClick={() => {}}
          />
        </Section>

        <Section>
          <Button onClick={onReset} fullWidth>
            Reset
          </Button>
        </Section>
      </Space>
    </>
  )
}
