import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, Space, Text, mq, theme } from 'ui'
import { useEditProductOffer } from '@/components/CartPage/useEditProductOffer'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CartFragmentFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
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
  const formatter = useFormatter()

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
      <SpaceFlex space={0.75}>
        <Layout.Pillow>
          <Pillow size="small" {...pillow} />
        </Layout.Pillow>

        <div>
          <Text>{titleLabel}</Text>
          <ShortSummary cartEntry={cartEntry} />
        </div>
      </SpaceFlex>

      <Space y={1}>
        <Layout.Details>
          <CartEntryCollapsible defaultOpen={defaultOpen} price={formatter.monthlyPrice(cost)}>
            <DetailsSheet {...cartEntry} />
          </CartEntryCollapsible>
        </Layout.Details>

        {!readOnly && (
          <ActionsRow>
            <EditEntryButton onConfirm={handleConfirmEdit} loading={editState === 'loading'} />

            <RemoveEntryDialog shopSessionId={shopSessionId} onCompleted={onRemove} {...cartEntry}>
              <Dialog.Trigger asChild>
                <Button variant="secondary-alt" size="small">
                  {t('REMOVE_ENTRY_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </RemoveEntryDialog>
          </ActionsRow>
        )}
      </Space>
    </Layout.Main>
  )
}

const Main = styled.li({
  padding: theme.space.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.opaque1,

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.md]: {
    padding: theme.space.lg,
    gap: theme.space.lg,
  },
})

const Layout = {
  Main,
  Pillow: styled.div({ flexShrink: 0 }),
  Details: styled.div({
    paddingTop: theme.space.md,
    borderTop: `1px solid ${theme.colors.borderTranslucent}`,
  }),
} as const

const ActionsRow = styled.div({
  display: 'flex',
  gap: theme.space.sm,
  '> *': {
    width: '50%',
  },
})
