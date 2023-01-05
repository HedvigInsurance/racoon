import { useTranslation } from 'next-i18next'
import { FormEventHandler, ReactNode } from 'react'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { CartEntry } from './CartInventory.types'
import { useRemoveCartEntry } from './useRemoveCartEntry'

const REMOVE_CART_ENTRY_FORM = 'remove-cart-entry-form'

type Props = CartEntry & { cartId: string; children: ReactNode }

export const RemoveEntryDialog = ({ children, cartId, offerId, title }: Props) => {
  const { t } = useTranslation('cart')

  const [removeCartEntry, { loading }] = useRemoveCartEntry({ cartId, offerId })

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    removeCartEntry()
  }

  return (
    <FullscreenDialog.Root>
      {children}

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
