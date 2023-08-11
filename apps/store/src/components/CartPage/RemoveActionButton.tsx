import { FormEventHandler, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ActionButton } from '../ProductItem/ProductItem'

type Props = {
  title: string
  onConfirm: () => void
  loading: boolean
}

export const RemoveActionButton = (props: Props) => {
  const { t } = useTranslation('cart')
  const formId = useId()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    props.onConfirm()
  }

  return (
    <FullscreenDialog.Root>
      <Dialog.Trigger asChild={true}>
        <ActionButton>{t('REMOVE_ENTRY_BUTTON')}</ActionButton>
      </Dialog.Trigger>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button form={formId} type="submit" loading={props.loading}>
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} />
        <Text size={{ _: 'md', lg: 'xl' }} align="center">
          {t('REMOVE_ENTRY_MODAL_PROMPT', { name: props.title })}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
