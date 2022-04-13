import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { Card, CardContent, CardProps } from '../Card/Card'

const HeaderElement = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  fontSize: '1rem',
  paddingTop: '3rem',
})

const TitleElement = styled.div({})

const ExtraElement = styled.div({
  color: colorsV3.gray500,
})

export type QuotePriceCardProps = Omit<CardProps, 'bordered'> & {
  children: React.ReactNode
  title?: React.ReactNode
  price?: string
}

export const QuotePriceCard = ({ children, title, price, ...props }: QuotePriceCardProps) => {
  return (
    <Card {...props} bordered>
      <CardContent>
        <HeaderElement>
          {title && <TitleElement>{title}</TitleElement>}
          {price && <ExtraElement>{price}</ExtraElement>}
        </HeaderElement>
        {children}
      </CardContent>
    </Card>
  )
}
