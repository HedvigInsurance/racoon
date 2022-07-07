import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { PriceCalculator } from '../PriceCalculator/PriceCalculator'
import { TestPricePageProps } from './TestPricePage.types'

const Section = styled.div(({ theme }) => ({
  padding: theme.space[4],
}))

const CartButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.space[4],
}))

const ButtonInner = styled(Space)(() => ({
  display: 'flex',
  alignItems: 'center',
}))

export const TestPricePage = ({ template, intent, onSubmit, onReset }: TestPricePageProps) => {
  console.log(JSON.stringify(template, null, 2))
  return (
    <>
      <Space y={3}>
        <PriceCalculator template={template} onSubmit={onSubmit} />

        <Section>
          {intent.product && (
            <div>
              <CartButton fullWidth>
                <p>SEK {intent.product.price}/month</p>

                <ButtonInner x={0.5}>
                  <p>Add to cart</p>
                </ButtonInner>
              </CartButton>
            </div>
          )}
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
