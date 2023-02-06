import { useTranslation } from 'next-i18next'
import { FormEventHandler, ReactNode, useId } from 'react'
import { Button, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { CartEntry } from './CartInventory.types'
import { useRemoveCartEntry } from './useRemoveCartEntry'

type Props = CartEntry & { cartId: string; children: ReactNode }

export const RemoveEntryDialog = ({ children, cartId, offerId, title }: Props) => {
  const { t } = useTranslation('cart')
  const formId = useId()

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
            <Button form={formId} type="submit" loading={loading} disabled={loading}>
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
        <form id={formId} onSubmit={handleSubmit} />
        <Text size={{ _: 'md', lg: 'xl' }} align="center">
          {t('REMOVE_ENTRY_MODAL_PROMPT', { name: title })}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
