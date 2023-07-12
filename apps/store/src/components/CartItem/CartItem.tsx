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
      <Main>
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

        {props.children}
      </Main>
    </Card>
  )
}

const Card = styled.div({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius.sm,
})

const Header = styled.div({
  padding: theme.space.lg,

  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.space.md,
  alignItems: 'center',

  cursor: 'pointer',

  '@media (hover: hover)': {
    [`${Card}:has(> &:hover)`]: {
      backgroundColor: theme.colors.grayTranslucent200,
    },
  },
})

const Main = styled.div({
  padding: theme.space.lg,
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
})

const Divider = styled.hr({
  height: 1,
  backgroundColor: theme.colors.borderTranslucent2,
})
