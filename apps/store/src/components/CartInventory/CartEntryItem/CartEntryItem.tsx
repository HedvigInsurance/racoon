import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, Text, mq, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { CartFragmentFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from '../CartInventory.types'
import { RemoveEntryDialog } from '../RemoveEntryDialog'
import { CartEntryCollapsible } from './CartEntryCollapsible'
import { DetailsSheet } from './DetailsSheet'

type Props = CartEntry & {
  cartId: string
  defaultOpen?: boolean
  readOnly?: boolean
  onRemove?: (cart: CartFragmentFragment) => void
}

export const CartEntryItem = ({ defaultOpen = false, ...props }: Props) => {
  const { cartId, readOnly, onRemove, ...cartEntry } = props
  const { title: titleLabel, startDate, cost, pillow } = cartEntry
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <Layout.Main>
      <Layout.Pillow>
        <Pillow size="small" {...pillow} />
      </Layout.Pillow>

      <Layout.Title>
        <Text>{titleLabel}</Text>
        <Text color="textSecondary">
          {startDate
            ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate) })
            : t('CART_ENTRY_AUTO_SWITCH')}
        </Text>
      </Layout.Title>

      <Layout.Details>
        <CartEntryCollapsible defaultOpen={defaultOpen} price={formatter.monthlyPrice(cost)}>
          <DetailsSheet {...cartEntry} />
        </CartEntryCollapsible>
      </Layout.Details>

      <Layout.Actions>
        <ActionsRow>
          {!readOnly && (
            <RemoveEntryDialog cartId={cartId} onCompleted={onRemove} {...cartEntry}>
              <Dialog.Trigger asChild>
                <Button variant="secondary-alt" size="small">
                  {t('REMOVE_ENTRY_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </RemoveEntryDialog>
          )}
        </ActionsRow>
      </Layout.Actions>
    </Layout.Main>
  )
}

const GRID_AREAS = {
  Pillow: 'pillow',
  Title: 'title',
  Details: 'details',
  Price: 'price',
  Content: 'content',
  Actions: 'actions',
  Empty: 'empty',
} as const

const Main = styled.li({
  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "${GRID_AREAS.Pillow} ${GRID_AREAS.Title} ${GRID_AREAS.Title}"
    "${GRID_AREAS.Details} ${GRID_AREAS.Details} ${GRID_AREAS.Details}"
    "${GRID_AREAS.Actions} ${GRID_AREAS.Actions} ${GRID_AREAS.Actions}"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',
  padding: theme.space.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.opaque1,

  [mq.md]: {
    padding: theme.space.lg,
  },
})

const Layout = {
  Main,
  Pillow: styled.div({
    gridArea: GRID_AREAS.Pillow,
    [mq.md]: {
      marginBottom: theme.space.xs,
    },
  }),
  Title: styled.div({ gridArea: GRID_AREAS.Title }),
  Details: styled.div({
    gridArea: GRID_AREAS.Details,
    paddingTop: theme.space.md,
    borderTop: `1px solid ${theme.colors.borderTranslucent}`,
  }),
  Price: styled.div({ gridArea: GRID_AREAS.Price }),
  Content: styled.div({ gridArea: GRID_AREAS.Content }),
  Actions: styled.div({ gridArea: GRID_AREAS.Actions }),
} as const

const ActionsRow = styled.div({
  display: 'flex',
  gap: theme.space.sm,
  '> *': {
    width: '50%',
  },
})
