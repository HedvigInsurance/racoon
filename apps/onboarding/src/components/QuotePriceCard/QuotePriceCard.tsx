import styled from '@emotion/styled'
import { Checkbox } from 'ui'
import { Card, CardContent } from '../Card/Card'
import { SelectableCard, SelectableCardProps } from '../Card/SelectableCard'

const HeaderElement = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  width: '100%',
  alignItems: 'end',
  fontSize: '1rem',
  paddingTop: '1.75rem',
  gap: '1rem',
})

const TitleElement = styled.div({})

const ExtraElement = styled.div(({ theme }) => ({
  color: theme.colors.gray500,
  justifySelf: 'end',
}))

export type QuotePriceCardProps = SelectableCardProps & {
  title?: React.ReactNode
  price?: string
  selectable?: boolean
}

export const QuotePriceCard = ({
  children,
  title,
  price,
  selectable,
  checked,
  ...props
}: QuotePriceCardProps) => {
  return selectable ? (
    <SelectableCard checked={checked} {...props}>
      <CardContent>
        <Checkbox circle checked={checked} />
        <HeaderElement>
          {title && <TitleElement>{title}</TitleElement>}
          {price && <ExtraElement>{price}</ExtraElement>}
        </HeaderElement>
        {children}
      </CardContent>
    </SelectableCard>
  ) : (
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
