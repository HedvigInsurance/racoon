import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, mq, Space, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'
import { DetailsSheetDialog } from './DetailsSheetDialog'
import { RemoveEntryDialog } from './RemoveEntryDialog'

type Props = CartEntry & { cartId: string }

export const CartEntryItem = (props: Props) => {
  const { cartId, ...cartEntry } = props
  const { title: titleLabel, startDate, cost, pillow } = cartEntry
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <Layout>
      <LayoutPillow>
        <Pillow size="small" {...pillow} />
      </LayoutPillow>

      <LayoutText>
        <Text>{titleLabel}</Text>
        <Text color="textSecondary">
          {/* @TODO: display "automatically switches" if cancellation is requested" */}
          {startDate
            ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate) })
            : 'Starts sometime...'}
        </Text>
      </LayoutText>

      <LayoutPrice>
        <Text>{formatter.monthlyPrice(cost)}</Text>
      </LayoutPrice>

      <LayoutActions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <DetailsSheetDialog {...cartEntry}>
              <Dialog.Trigger asChild>
                <Button variant="secondary" size="small">
                  {t('VIEW_ENTRY_DETAILS_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </DetailsSheetDialog>
            <RemoveEntryDialog cartId={cartId} {...cartEntry}>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="small">
                  {t('REMOVE_ENTRY_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </RemoveEntryDialog>
          </SpaceFlex>
        </Space>
      </LayoutActions>
    </Layout>
  )
}

const Layout = styled.li({
  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "pillow title"
    "empty price"
    "empty actions"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',

  [mq.md]: {
    gridTemplateAreas: `
      "pillow title price"
      "empty actions actions"
    `,
    gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  },
})

const LayoutPillow = styled.div({ gridArea: 'pillow' })
const LayoutText = styled.div({ gridArea: 'title' })
const LayoutPrice = styled.div({ gridArea: 'price' })
const LayoutActions = styled.div({ gridArea: 'actions' })
