import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link, { LinkProps } from 'next/link'
import { FormEvent } from 'react'
import { Button, Dialog, Space, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useCartEntryRemoveMutation } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { CartEntry } from './CartInventory.types'

const REMOVE_CART_ENTRY_FORM = 'remove-cart-entry-form'

type Props = CartEntry & { cartId: string }

export const CartEntryItem = (props: Props) => {
  const { cartId, offerId, title, startDate, cost, pillow } = props
  const { t } = useTranslation('cart')
  const formatter = useFormatter()

  const [removeCartEntry, { loading }] = useCartEntryRemoveMutation({
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const handleSubmit = (offerId: string) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await removeCartEntry({ variables: { cartId, offerId } })
  }

  return (
    <FullscreenDialog.Root>
      <Wrapper>
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
              <TextButton disabled={loading}>{t('REMOVE_ENTRY_BUTTON', { ns: 'cart' })}</TextButton>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text size="md">{formatter.monthlyPrice(cost)}</Text>
      </Wrapper>

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
            </FullscreenDialog.Close>
          </>
        }
      >
        <form id={REMOVE_CART_ENTRY_FORM} onSubmit={handleSubmit(offerId)} />
        <Text size={{ _: 'md', lg: 'xl' }} align="center">
          {t('REMOVE_ENTRY_MODAL_PROMPT', { ns: 'cart', name: title })}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const Wrapper = styled.li(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '3rem minmax(0, 1fr) auto',
  gap: theme.space[3],
}))

const SecondaryButton = styled.button(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingTop: theme.space[2],
  paddingBottom: theme.space[2],
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
