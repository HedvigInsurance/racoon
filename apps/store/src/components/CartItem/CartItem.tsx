import styled from '@emotion/styled'
import { type ReactNode, useState } from 'react'
import { Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { Collapsible } from './Collapsible'
import { DetailsSheet } from './DetailsSheet'
import { ShortSummary } from './ShortSummary'

type Props = {
  pillow: { src: string; alt?: string | null }
  displayName: string
  children: ReactNode
  startDate?: Date
  productName: string
  cost: ProductOfferFragment['cost']
  documents: ProductOfferFragment['variant']['documents']
  data: ProductOfferFragment['priceIntentData']
  tierLevelDisplayName?: string
  deductibleDisplayName?: string
  defaultExpanded?: boolean
}

export const CartItem = (props: Props) => {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  return (
    <Card>
      <Hoverable>
        <Header onClick={() => setExpanded((prev) => !prev)}>
          <Pillow size="small" {...props.pillow} />
          <div>
            <Text as="p" size="md">
              {props.displayName}
            </Text>
            <ShortSummary
              startDate={props.startDate}
              productName={props.productName}
              data={props.data}
            />
          </div>
        </Header>

        <Divider />

        <Collapsible open={expanded} onOpenChange={setExpanded} cost={props.cost}>
          <DetailsSheet
            documents={props.documents}
            productName={props.productName}
            data={props.data}
            tierLevelDisplayName={props.tierLevelDisplayName}
            deductibleDisplayName={props.deductibleDisplayName}
          />
        </Collapsible>
      </Hoverable>
      <BottomRow>{props.children}</BottomRow>
    </Card>
  )
}

const Card = styled.div({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius[1],
})

const Hoverable = styled.div({
  '@media (hover: hover)': {
    cursor: 'pointer',

    [`${Card}:has(> &:hover)`]: {
      backgroundColor: theme.colors.grayTranslucent200,
    },
  },
})

const Header = styled.div({
  padding: theme.space.lg,

  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.space.md,
  alignItems: 'center',
})

const BottomRow = styled.div({
  paddingInline: theme.space.lg,
  paddingTop: theme.space.md,
  paddingBottom: theme.space.lg,
})

const Divider = styled.hr({
  height: 1,
  backgroundColor: theme.colors.borderTranslucent2,
  marginInline: theme.space.lg,
})
