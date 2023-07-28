import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { type ReactNode, useState } from 'react'
import { Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { type ProductOfferFragment } from '@/services/apollo/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
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
  const { shopSession } = useShopSession()

  const cartEntry = shopSession?.cart.entries.find(
    (cartEntry) => cartEntry.variant.product.name === props.productName,
  )
  if (!cartEntry) {
    datadogLogs.logger.error(`[CartItem]: could not found cart entry for ${props.productName}`, {
      shopSessionId: shopSession?.id,
    })
    return null
  }

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
            displayItems={cartEntry.displayItems}
            documents={props.documents}
            // TODO: take tierLevel and deductible from ProductOffer.displayItems as well.
            tierLevelDisplayName={props.tierLevelDisplayName}
            deductibleDisplayName={props.deductibleDisplayName}
          />
        </Collapsible>
      </Hoverable>
      {props.children ? (
        <BottomRow>{props.children}</BottomRow>
      ) : (
        <div style={{ height: theme.space.lg }} />
      )}
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
