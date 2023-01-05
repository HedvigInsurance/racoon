import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEvent } from 'react'
import { Button, Dialog, Space, Text } from 'ui'
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
        <Pillow size="small" {...pillow} />
        <Space y={1}>
          <div>
            <Text size="md">{title}</Text>
            <Text size="md" color="textSecondary">
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
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="small" disabled={loading}>
                {t('REMOVE_ENTRY_BUTTON')}
              </Button>
            </Dialog.Trigger>
          </SpaceFlex>
        </Space>
        <Text size="md">{formatter.monthlyPrice(cost)}</Text>
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
  gap: theme.space[3],
}))
