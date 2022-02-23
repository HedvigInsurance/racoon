import { Heading, Space, theme } from 'ui'
import { MonthlyPrice, PriceProps } from './monthly-price'

import { Badge } from './badge'
import { Stars } from './icons/stars'
import styled from '@emotion/styled'

type IntroProps = {} & PriceProps

const Wrapper = styled.div({
  padding: '1.25rem 1rem',
})

const Row = styled(Space)({
  display: 'flex',
  marginTop: '0.5rem',
  alignItems: 'center',
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

export const Intro = ({ price }: IntroProps) => {
  return (
    <Wrapper>
      <Heading headingLevel="h2" variant="s" colorVariant="dark">
        Home owners + Accident
      </Heading>
      <Space y={1.5}>
        <Row x={0.5}>
          <MonthlyPrice price={price} />
          <Badge>20% OFF</Badge>
        </Row>
        <div>
          <Reviews x={0.25}>
            <span>4,9</span>
            <Stars />
            <span>1697 reviews</span>
          </Reviews>
          <Text>Lindholmsallén 26B, Lindholmen, Göteborg</Text>
        </div>
      </Space>
    </Wrapper>
  )
}
