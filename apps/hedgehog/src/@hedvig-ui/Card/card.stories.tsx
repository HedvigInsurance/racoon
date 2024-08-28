import { Card, CardsWrapper } from '@hedvig-ui'
import * as React from 'react'

export default {
  title: 'Card',
  component: Card,
  decorators: [],
}

export const SimpleCard: React.FC = () => (
  <CardsWrapper>
    <Card span={2}>Card contents</Card>
    <Card span={2}>Card contents</Card>
    <Card span={2}>Card contents</Card>
  </CardsWrapper>
)
