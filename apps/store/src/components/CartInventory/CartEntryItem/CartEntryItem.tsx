import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button, Dialog, Text, mq, theme } from 'ui'
import { useEditProductOffer } from '@/components/CartPage/useEditProductOffer'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type CartFragmentFragment } from '@/services/apollo/generated'
import { CartEntry } from '../CartInventory.types'
import { RemoveEntryDialog } from '../RemoveEntryDialog'
import { CartEntryCollapsible } from './CartEntryCollapsible'
import { DetailsSheet } from './DetailsSheet'
import { EditEntryButton } from './EditEntryButton'
import { ShortSummary } from './ShortSummary'

type Props = CartEntry & {
  shopSessionId: string
  defaultOpen?: boolean
  readOnly?: boolean
  onRemove?: (cart: CartFragmentFragment) => void
}

export const CartEntryItem = ({ defaultOpen = false, ...props }: Props) => {
  const { shopSessionId, readOnly, onRemove, ...cartEntry } = props
  const { title: titleLabel, cost, pillow } = cartEntry
  const { t } = useTranslation('cart')
  const [expanded, setExpanded] = useState(defaultOpen)

  const [editProductOffer, editState] = useEditProductOffer()
  const handleConfirmEdit = () => {
    editProductOffer({
      shopSessionId,
      offerId: cartEntry.offerId,
      productName: cartEntry.productName,
      data: cartEntry.data,
    })
  }

  return (
    <Layout.Main>
      <Clickable onClick={() => setExpanded((prev) => !prev)}>
        <SpaceFlex space={0.75}>
          <Layout.Pillow>
            <Pillow size="small" {...pillow} />
          </Layout.Pillow>

          <div>
            <Text>{titleLabel}</Text>

            <ShortSummary
              startDate={cartEntry.startDate}
              productName={cartEntry.productName}
              data={cartEntry.data}
            />
          </div>
        </SpaceFlex>
      </Clickable>

      <Layout.Bottom>
        <Layout.Details>
          <CartEntryCollapsible open={expanded} onOpenChange={setExpanded} cost={cost}>
            <DetailsSheet {...cartEntry} />
          </CartEntryCollapsible>
        </Layout.Details>

        {!readOnly && (
          <ActionsRow>
            <EditEntryButton onConfirm={handleConfirmEdit} loading={editState === 'loading'} />

            <RemoveEntryDialog shopSessionId={shopSessionId} onCompleted={onRemove} {...cartEntry}>
              <Dialog.Trigger asChild={true}>
                <Button variant="secondary-alt" size="medium">
                  {t('REMOVE_ENTRY_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </RemoveEntryDialog>
          </ActionsRow>
        )}
      </Layout.Bottom>
    </Layout.Main>
  )
}

const Main = styled.li({
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.opaque1,
})

const Clickable = styled.div({
  cursor: 'pointer',

  '@media (hover: hover)': {
    [`${Main}:has(> &:hover)`]: {
      backgroundColor: theme.colors.grayTranslucent200,
    },
  },

  padding: theme.space.md,
  [mq.md]: { padding: theme.space.lg },
})

const Bottom = styled.div({
  paddingInline: theme.space.md,
  paddingBottom: theme.space.md,

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.md]: {
    paddingInline: theme.space.lg,
    paddingBottom: theme.space.lg,
  },
})

const Layout = {
  Main,
  Bottom,
  Pillow: styled.div({ flexShrink: 0 }),
  Details: styled.div({
    paddingTop: theme.space.md,
    paddingInline: theme.space.xxxs,
    borderTop: `1px solid ${theme.colors.borderTranslucent2}`,
  }),
} as const

const ActionsRow = styled.div({
  display: 'grid',
  gap: theme.space.sm,
  gridTemplateColumns: '1fr 1fr',
})
