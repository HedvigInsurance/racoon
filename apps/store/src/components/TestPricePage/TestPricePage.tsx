import styled from '@emotion/styled'
import { Space } from 'ui'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { PriceCard } from '@/components/PriceCard/PriceCard'
import { TestPricePageProps } from './TestPricePage.types'

const Section = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

export const TestPricePage = ({ template, product }: TestPricePageProps) => {
  return (
    <>
      <Space y={3}>
        <PriceCalculator template={template} />

        <Section>
          <PriceCard
            name={product.name}
            cost={product.price}
            currency={product.currentCode}
            gradient={['#AAAAAA', '#828282']}
            onClick={() => {}}
          />
        </Section>
      </Space>
    </>
  )
}
