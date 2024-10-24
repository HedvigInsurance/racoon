'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import { useTranslation } from 'next-i18next'
import { useFormState } from 'react-dom'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Space, Text } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { InputDay } from '@/components/InputDay/InputDay'
import { HandledMessage } from './HandledMessage'
import {
  checkbox,
  checkboxIndicator,
  checkboxRoot,
  wrapper,
} from './InsuranceSwitcherExpirationDateForm.css'
import { submitSwitchConfirmation } from './submitSwitchConfirmation'

type Props = { id: string }

export default function InsuranceSwitchExpirationDateForm({ id }: Props) {
  const { t } = useTranslation('contractSwitchConfirmationForm')
  const [state, formAction] = useFormState(submitSwitchConfirmation, null)

  const isSuccessful = state?.messages?.some((message) => message.type === 'success')

  return (
    <div className={wrapper}>
      <Text className={sprinkles({ mb: 'md' })}>{t('SWITCH_CONFIRMATION_FORM_INTRO')}</Text>
      <form action={formAction}>
        <Space y={0.25}>
          <InputDay
            name="expiryDate"
            label={t('SWITCH_CONFIRMATION_FORM_DATE_LABEL')}
            required={true}
          />

          <div className={checkbox}>
            <Checkbox.Root id="confirmation" name="confirmation" className={checkboxRoot} required>
              <Checkbox.Indicator className={checkboxIndicator}>
                <CheckIcon size="1rem" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <Text size="md">
              <label htmlFor="confirmation">{t('SWITCH_CONFIRMATION_FORM_CHECK_LABEL')}</label>
            </Text>
          </div>

          <input type="text" name="id" defaultValue={id} hidden />

          <SubmitButton>{t('SWITCH_CONFIRMATION_FORM_SUBMIT')}</SubmitButton>

          {isSuccessful ? <HandledMessage /> : null}

          <ErrorMessages errors={state?.errors?.generic} />
        </Space>
      </form>
    </div>
  )
}
