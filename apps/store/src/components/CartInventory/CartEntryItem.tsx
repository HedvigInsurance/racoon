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
  const { title, startDate, cost, pillow } = cartEntry
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  return (
    <Wrapper>
      <DesktopPillowWithTitle>
        <DesktopPillowWrapper>
          <Pillow size="small" {...pillow} />
        </DesktopPillowWrapper>
        <DesktopTitle>{title}</DesktopTitle>
      </DesktopPillowWithTitle>
      <Space y={1}>
        <div>
          <MobileTitle>{title}</MobileTitle>
          <Text color="textSecondary">
            {/* @TODO: display "automatically switches" if cancellation is requested" */}
            {startDate
              ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate) })
              : 'Starts sometime...'}
          </Text>
        </div>
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
      <Text align="right">{formatter.monthlyPrice(cost)}</Text>
    </Wrapper>
  )
}

const Wrapper = styled.li({
  display: 'grid',
  gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  gap: theme.space.sm,

  [mq.lg]: {
    paddingTop: theme.space.sm,
    gridTemplateColumns: '1fr minmax(0, 1fr) auto',
  },
})

const DesktopTitle = styled(Text)({
  display: 'none',

  [mq.lg]: {
    display: 'revert',
  },
})

const MobileTitle = styled(Text)({
  [mq.lg]: {
    display: 'none',
  },
})

const DesktopPillowWithTitle = styled.div({
  display: 'flex',
  gap: theme.space.sm,
})

const DesktopPillowWrapper = styled.div({
  [mq.lg]: {
    marginTop: `-${theme.space.sm}`,
  },
})
