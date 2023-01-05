import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEvent } from 'react'
import { Button, Dialog, mq, Space, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'
import { DetailsSheetDialog } from './DetailsSheetDialog'
import { useRemoveCartEntry } from './useRemoveCartEntry'

const REMOVE_CART_ENTRY_FORM = 'remove-cart-entry-form'

type Props = CartEntry & { cartId: string }

export const CartEntryItem = (props: Props) => {
  const { cartId, ...cartEntry } = props
  const { offerId, title, startDate, cost, pillow } = cartEntry
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const [removeCartEntry, { loading }] = useRemoveCartEntry({ cartId, offerId })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    removeCartEntry()
  }

  return (
    <FullscreenDialog.Root>
      <Wrapper>
        <PillowWrapper>
          <DesktopPillowFlexItem>
            <Pillow size="small" {...pillow} />
            <DesktopTitle size="md">{title}</DesktopTitle>
          </DesktopPillowFlexItem>
        </PillowWrapper>
        <Space y={1}>
          <div>
            <MobileTitle size="md">{title}</MobileTitle>
            <Text size="md" color="textSecondary">
              {/* @TODO: display "automatically switches" if cancellation is requested" */}
              {startDate
                ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate), ns: 'cart' })
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
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="small" disabled={loading}>
                {t('REMOVE_ENTRY_BUTTON')}
              </Button>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text align="right" size="md">
          {formatter.monthlyPrice(cost)}
        </Text>
      </Wrapper>

      <FullscreenDialog.Modal
        center
        Footer={
          <>
            <Button
              form={REMOVE_CART_ENTRY_FORM}
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <form id={REMOVE_CART_ENTRY_FORM} onSubmit={handleSubmit} />
        <Text size={{ _: 'md', lg: 'xl' }} align="center">
          {t('REMOVE_ENTRY_MODAL_PROMPT', { name: title })}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const Wrapper = styled.li(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  gap: theme.space.sm,
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr 2fr',
    gap: theme.space.sm,
  },
}))

const PillowWrapper = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  [mq.lg]: {
    display: 'flex',
    alignItems: 'flex-start',
  },
})

const DesktopTitle = styled(Text)({
  display: 'none',
  [mq.lg]: {
    display: 'block',
  },
})

const MobileTitle = styled(Text)({
  [mq.lg]: {
    display: 'none',
  },
})

const DesktopPillowFlexItem = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
}))
