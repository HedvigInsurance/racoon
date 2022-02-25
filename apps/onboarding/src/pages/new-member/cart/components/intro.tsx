import { Heading, Space, theme } from 'ui'
import { MonthlyPrice, PriceProps } from './monthly-price'

import { Stars } from './icons/stars'
import styled from '@emotion/styled'

export type IntroProps = {
  street: string,
} & PriceProps

const Wrapper = styled.div({
  padding: '1.25rem 1rem',
})

const Row = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: '0.25rem',
})

const Reviews = styled(Row)({
  fontSize: '0.75rem',
})

const Text = styled.p({
  margin: '0.25rem 0 0',
  fontSize: '0.75rem',
  lineHeight: 1.4,
  color: theme.colors.gray700,
})

export const Intro = ({ street, price }: IntroProps) => {
  return (
    <Wrapper>
      <Heading headingLevel="h2" variant="s" colorVariant="dark">
        {street}
      </Heading>
      <div>
        <Row x={0}>
          <MonthlyPrice price={price} />
        </Row>
        <div>
          <Reviews x={0.25}>
            <span>4,9</span>
            <Stars />
            <span>1697 reviews</span>
          </Reviews>
        </div>
      </div>
    </Wrapper>
  )
}
