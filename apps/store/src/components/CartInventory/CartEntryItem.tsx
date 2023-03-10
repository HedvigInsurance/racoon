import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, CrossIconSmall, Dialog, Space, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'
import { DetailsSheetDialog } from './DetailsSheetDialog'
import { RemoveEntryDialog } from './RemoveEntryDialog'

type Props = CartEntry & { cartId: string; readOnly?: boolean }

export const CartEntryItem = (props: Props) => {
  const { cartId, readOnly, ...cartEntry } = props
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

      <Layout.Close>
        {!readOnly && (
          <SpaceFlex align="end" direction="vertical">
            <RemoveEntryDialog cartId={cartId} {...cartEntry}>
              <Dialog.Trigger asChild>
                <InvisibleButton aria-label="delete button">
                  <CrossIconSmall color={theme.colors.textTertiary} />
                </InvisibleButton>
              </Dialog.Trigger>
            </RemoveEntryDialog>
          </SpaceFlex>
        )}
      </Layout.Close>

      <Layout.Price>
        <PriceFlex>
          <Text>{formatter.monthlyPrice(cost)}</Text>
        </PriceFlex>
      </Layout.Price>

      <Layout.Actions>
        <Space y={1}>
          <SpaceFlex space={0.25}>
            <DetailsSheetDialog {...cartEntry}>
              <Dialog.Trigger asChild>
                <Button variant="secondary" size="small">
                  {t('VIEW_ENTRY_DETAILS_BUTTON')}
                </Button>
              </Dialog.Trigger>
            </DetailsSheetDialog>
          </SpaceFlex>
        </Space>
      </Layout.Actions>
    </Layout.Main>
  )
}

const GRID_AREAS = {
  Pillow: 'pillow',
  Title: 'title',
  Price: 'price',
  Content: 'content',
  Actions: 'actions',
  Close: 'close',
  Empty: 'empty',
} as const

const Main = styled.li({
  display: 'grid',
  columnGap: theme.space.sm,
  rowGap: theme.space.md,
  gridTemplateAreas: `
    "${GRID_AREAS.Pillow} ${GRID_AREAS.Title} ${GRID_AREAS.Close}"
    "${GRID_AREAS.Empty} ${GRID_AREAS.Actions} ${GRID_AREAS.Price}"
  `,
  gridTemplateColumns: '3rem minmax(0, 1fr)',
})

const Layout = {
  Main,
  Pillow: styled.div({ gridArea: GRID_AREAS.Pillow }),
  Title: styled.div({ gridArea: GRID_AREAS.Title }),
  Price: styled.div({ gridArea: GRID_AREAS.Price }),
  Content: styled.div({ gridArea: GRID_AREAS.Content }),
  Actions: styled.div({ gridArea: GRID_AREAS.Actions }),
  Close: styled.div({ gridArea: GRID_AREAS.Close }),
} as const

const InvisibleButton = styled.button({
  cursor: 'pointer',
  paddingLeft: theme.space.xs,
  paddingBottom: theme.space.xs,
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
    borderRadius: '0.25rem',
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },
})

const PriceFlex = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})
