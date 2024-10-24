'use client'

import { useTranslation } from 'next-i18next'
import type { ComponentProps } from 'react'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { Alert } from 'ui'
import { handledMessage } from './InsuranceSwitcherExpirationDateForm.css'

type Props = ComponentProps<typeof Alert.Root>

export function HandledMessage(props: Props) {
  const { t } = useTranslation('contractSwitchConfirmationForm')

  return (
    <Alert.Root variant="success" className={handledMessage} {...props}>
      <Alert.Icon icon={CheckIcon} />
      <Alert.Body>
        <Alert.Message>{t('SWITCH_CONFIRMATION_FORM_HANDLED')}</Alert.Message>
      </Alert.Body>
    </Alert.Root>
  )
}
