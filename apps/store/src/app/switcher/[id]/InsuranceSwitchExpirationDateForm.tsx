'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { useFormState } from 'react-dom'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { CheckIcon, Space, Text } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { CampaignCard } from '@/components/InfoCard/InfoCard'
import { InputDay } from '@/components/InputDay/InputDay'
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

  console.log({ id })

  return (
    <div className={clsx(wrapper, sprinkles({ py: 'xxxl' }))}>
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

          {state?.messages?.map((message) => (
            <CampaignCard key={message.content}>
              <span className={sprinkles({ mt: 'xxxs' })}>{message.content}</span>
            </CampaignCard>
          )) ?? null}
          <ErrorMessages errors={state?.errors?.generic} />
        </Space>
      </form>
    </div>
  )
}