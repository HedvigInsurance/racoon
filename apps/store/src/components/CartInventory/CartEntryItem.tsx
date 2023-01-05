import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link, { LinkProps } from 'next/link'
import { FormEvent } from 'react'
import { Button, Dialog, mq, Space, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
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
    <FullscreenDialog.Root>
      <MobileWrapper>
        <Pillow size="small" {...pillow} />
        <Space y={1}>
          <div>
            <Text size="md">{title}</Text>
            <Text size="md" color="textSecondary">
              {/* @TODO: display "automatically switches" if cancellation is requested" */}
              {startDate
                ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate), ns: 'cart' })
                : 'Starts sometime...'}
            </Text>
          </div>
          <SpaceFlex space={0.25}>
            <LinkButtonSecondary href="#">
              {t('VIEW_ENTRY_DETAILS_BUTTON', { ns: 'cart' })}
            </LinkButtonSecondary>
            <Dialog.Trigger asChild>
              <Button variant="secondary" size="small">
                {t('VIEW_ENTRY_DETAILS_BUTTON')}
              </Button>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text size="md">{formatter.monthlyPrice(cost)}</Text>
      </MobileWrapper>

      <DesktopWrapper>
        <DesktopPillowTitle>
          <DesktopPillowFlexItem>
            <Pillow size="small" {...pillow} />
            <Text size="md">{title}</Text>
          </DesktopPillowFlexItem>
        </DesktopPillowTitle>
        <Space y={1}>
          <div>
            <Text size="md" color="textSecondary">
              {/* @TODO: display "automatically switches" if cancellation is requested" */}
              {startDate
                ? t('CART_ENTRY_DATE_LABEL', { date: formatter.fromNow(startDate), ns: 'cart' })
                : 'Starts sometime...'}
            </Text>
          </div>
          <SpaceFlex space={0.25}>
            <LinkButtonSecondary href="#">
              {t('VIEW_ENTRY_DETAILS_BUTTON', { ns: 'cart' })}
            </LinkButtonSecondary>
            <Dialog.Trigger asChild>
              <TextButton disabled={loading}>{t('REMOVE_ENTRY_BUTTON', { ns: 'cart' })}</TextButton>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text align="right" size="md">
          {formatter.monthlyPrice(cost)}
        </Text>
      </DesktopWrapper>

      <FullscreenDialog.Modal
        Footer={
          <>
            <Button
              form={REMOVE_CART_ENTRY_FORM}
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON', { ns: 'cart' })}
            </Button>
            <FullscreenDialog.Close asChild>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON', { ns: 'cart' })}
              </Button>
            </Dialog.Trigger>
          </RemoveEntryDialog>
        </SpaceFlex>
      </Space>
      <Text size="md">{formatter.monthlyPrice(cost)}</Text>
    </Wrapper>
  )
}

const MobileWrapper = styled.li(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  gap: theme.space.sm,
  [mq.lg]: {
    display: 'none',
    gridTemplateColumns: '3fr 2fr 2fr',
    gap: theme.space.sm,
  },
}))

const DesktopWrapper = styled.li(({ theme }) => ({
  display: 'none',
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '3fr 2fr 2fr',
    gap: theme.space.sm,
  },
}))

const DesktopPillowTitle = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
})

const DesktopPillowFlexItem = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
}))

const SecondaryButton = styled.button(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  padding: `${theme.space.xs} ${theme.space.md}`,
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  ':disabled': {
    opacity: 0.6,
  },
}))

const LinkButtonSecondary = styled(SecondaryButton)<LinkProps>()
LinkButtonSecondary.defaultProps = { as: Link }

const TextButton = styled(SecondaryButton)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
})
