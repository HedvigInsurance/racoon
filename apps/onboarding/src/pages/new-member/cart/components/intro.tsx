import { MonthlyPrice, PriceProps } from './monthly-price'

import { Heading } from 'ui'
import styled from '@emotion/styled'

type IntroProps = {} & PriceProps

const Wrapper = styled.div({
  padding: '1.25rem 1rem',
})

export const Intro = ({price}: IntroProps) => {
  return (
    <Wrapper>
      <Heading headingLevel="h2" variant="s" colorVariant="dark">
        Home owners + Accident
      </Heading>
      <MonthlyPrice price={price} />
    </Wrapper>
  )
}
