import styled from '@emotion/styled'
import { type ReactNode, useState } from 'react'
import { Text, theme } from 'ui'
import { type CartEntry } from '@/components/CartInventory/CartInventory.types'
import { Pillow } from '@/components/Pillow/Pillow'
import { Collapsible } from './Collapsible'
import { DetailsSheet } from './DetailsSheet'
import { ShortSummary } from './ShortSummary'

type Props = CartEntry & {
  children: ReactNode
  defaultExpanded?: boolean
}

export const CartItem = ({ children, defaultExpanded, ...cartEntry }: Props) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)

  return (
    <Card>
      <Hoverable>
        <Header onClick={() => setExpanded((prev) => !prev)}>
          <Pillow size="small" {...cartEntry.pillow} />
          <div>
            <Text as="p" size="md">
              {cartEntry.title}
            </Text>
            <ShortSummary
              // TODO: fix that type definition
              startDate={cartEntry.startDate ?? undefined}
              productName={cartEntry.productName}
              data={cartEntry.data}
            />
          </div>
        </Header>

        <Divider />

        <Collapsible open={expanded} onOpenChange={setExpanded} cost={cartEntry.cost}>
          <DetailsSheet
            displayItems={cartEntry.displayItems}
            documents={cartEntry.documents}
            // TODO: take tierLevel and deductible from ProductOffer.displayItems as well.
            tierLevelDisplayName={cartEntry.tierLevelDisplayName}
            deductibleDisplayName={cartEntry.deductibleDisplayName}
          />
        </Collapsible>
      </Hoverable>
      {children ? <BottomRow>{children}</BottomRow> : <div style={{ height: theme.space.lg }} />}
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
